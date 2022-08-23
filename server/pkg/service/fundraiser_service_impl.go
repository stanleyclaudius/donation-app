package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"donation_app/pkg/token"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type FundraiserServiceImpl struct {
	FundraiserRepository repository.FundraiserRepository
	DB                   *sql.DB
}

func NewFundraiserService(db *sql.DB) FundraiserService {
	fundraiserRepository := repository.NewFundraiserRepository(db)

	return &FundraiserServiceImpl{
		FundraiserRepository: fundraiserRepository,
		DB:                   db,
	}
}

type CreateFundraiserRequest struct {
	Phone       string `json:"phone" binding:"required"`
	Address     string `json:"address" binding:"required"`
	Description string `json:"description" binding:"required"`
}

func (service *FundraiserServiceImpl) CreateFundraiser(ctx *gin.Context) {
	authPayload := ctx.MustGet("authorization_payload").(*token.Payload)

	var req CreateFundraiserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to create fundraiser account."})
		return
	}

	checkFundraiserArg := repository.GetFundraiserByUserIDParams{
		UserID: authPayload.UserID,
	}

	_, err := service.FundraiserRepository.GetOneByUserID(ctx, checkFundraiserArg)
	if err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Fundraiser with current user account already exists."})
		return
	}

	saveFundraiserArg := repository.SaveFundraiserParams{
		UserID:      authPayload.UserID,
		Phone:       req.Phone,
		Address:     req.Address,
		Description: req.Description,
	}

	fundraiser, err := service.FundraiserRepository.Save(ctx, saveFundraiserArg)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Phone number has been used before."})
				return
			}
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create fundraiser. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"fundraiser": fundraiser})
}
