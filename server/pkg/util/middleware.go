package util

import (
	"database/sql"
	"donation_app/pkg/repository"
	"donation_app/pkg/token"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(pasetoToken *token.PasetoToken) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authorizationHeader := ctx.GetHeader("authorization")
		if len(authorizationHeader) == 0 {
			err := errors.New("authorization header is not provided")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		fields := strings.Fields(authorizationHeader)
		if len(fields) < 2 {
			err := errors.New("invalid authorization header format")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		authorizationType := strings.ToLower(fields[0])
		if authorizationType != "bearer" {
			err := fmt.Errorf("unsupported authorization type %s", authorizationType)
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		accessToken := fields[1]
		payload, err := pasetoToken.VerifyToken(accessToken)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		ctx.Set("authorization_payload", payload)
		ctx.Next()
	}
}

func AdminMiddleware(db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authPayload := ctx.MustGet("authorization_payload").(*token.Payload)
		userRepository := repository.NewUserRepository(db)

		arg := repository.GetOneUserByIDParams{
			ID: authPayload.UserID,
		}

		user, err := userRepository.GetOneById(ctx, arg)
		if err != nil {
			if err == sql.ErrNoRows {
				ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User not found."})
				return
			}

			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user. Please try again later."})
			return
		}

		if user.Role != "admin" {
			err := fmt.Errorf("%s role doesn't have access to this resource", user.Role)
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		}

		ctx.Next()
	}
}

func FundraiserMiddleware(db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authPayload := ctx.MustGet("authorization_payload").(*token.Payload)
		userRepository := repository.NewUserRepository(db)
		fundraiserRepository := repository.NewFundraiserRepository(db)

		userArg := repository.GetOneUserByIDParams{
			ID: authPayload.UserID,
		}

		user, err := userRepository.GetOneById(ctx, userArg)
		if err != nil {
			if err == sql.ErrNoRows {
				ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User not found."})
				return
			}

			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user. Please try again later."})
			return
		}

		if user.Role != "fundraiser" {
			err := fmt.Errorf("%s role doesn't have access to this resource", user.Role)
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		fundraiserArg := repository.GetFundraiserByUserIDParams{
			UserID: user.ID,
		}

		fundraiser, err := fundraiserRepository.GetOneByUserID(ctx, fundraiserArg)
		if err != nil {
			if err == sql.ErrNoRows {
				ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Fundraiser not found."})
				return
			}

			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve fundraiser. Please try again later."})
			return
		}

		ctx.Set("fundraiser_id", fundraiser.ID)
		ctx.Next()
	}
}
