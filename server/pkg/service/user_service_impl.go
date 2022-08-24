package service

import (
	"database/sql"
	"donation_app/pkg/model"
	"donation_app/pkg/repository"
	"donation_app/pkg/token"
	"donation_app/pkg/util"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type UserServiceImpl struct {
	UserRepository repository.UserRepository
	PasetoToken    *token.PasetoToken
	DB             *sql.DB
	Config         util.Config
}

func NewUserService(db *sql.DB, config util.Config, pasetoToken *token.PasetoToken) UserService {
	userRepository := repository.NewUserRepository(db)

	return &UserServiceImpl{
		PasetoToken:    pasetoToken,
		UserRepository: userRepository,
		DB:             db,
		Config:         config,
	}
}

type UserResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Avatar    string    `json:"avatar"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	Role      string    `json:"role"`
}

func newUserResponse(user model.User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Avatar:    user.Avatar,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		Role:      user.Role,
	}
}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

func (service *UserServiceImpl) Register(ctx *gin.Context) {
	var req RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to register."})
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	arg := repository.SaveUserParams{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
	}

	user, err := service.UserRepository.Save(ctx, arg)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email has been used before."})
				return
			}
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": newUserResponse(user)})
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (service *UserServiceImpl) Login(ctx *gin.Context) {
	var req LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to login."})
		return
	}

	arg := repository.GetOneUserByEmailParams{
		Email: req.Email,
	}

	user, err := service.UserRepository.GetOneByEmail(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credential."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user. Please try again later."})
		return
	}

	err = util.VerifyPassword(req.Password, user.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credential."})
		return
	}

	accessToken, err := service.PasetoToken.CreateToken(user.ID, service.Config.AccessTokenDuration)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create access token."})
		return
	}

	refreshToken, err := service.PasetoToken.CreateToken(user.ID, service.Config.RefreshTokenDuration)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create refresh token."})
		return
	}

	ctx.SetCookie("donation_app_rf_token", refreshToken, 24*60*60, "/", "localhost", false, true)

	ctx.JSON(http.StatusOK, gin.H{"access_token": accessToken, "user": newUserResponse(user)})
}

func (service *UserServiceImpl) RefreshToken(ctx *gin.Context) {
	cookie, err := ctx.Cookie("donation_app_rf_token")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Cookie is invalid."})
		return
	}

	payload, err := service.PasetoToken.VerifyToken(cookie)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err})
		return
	}

	arg := repository.GetOneUserByIDParams{
		ID: payload.UserID,
	}

	user, err := service.UserRepository.GetOneById(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user. Please try again later."})
		return
	}

	accessToken, err := service.PasetoToken.CreateToken(user.ID, service.Config.AccessTokenDuration)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create access token."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"access_token": accessToken, "user": newUserResponse(user)})
}

func (service *UserServiceImpl) Logout(ctx *gin.Context) {
	authPayload := ctx.MustGet("authorization_payload").(*token.Payload)

	arg := repository.GetOneUserByIDParams{
		ID: authPayload.UserID,
	}

	_, err := service.UserRepository.GetOneById(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not found."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user. Please try again later."})
		return
	}

	ctx.SetCookie("donation_app_rf_token", "", -24*60*60, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{"message": "Logout success."})
}
