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
	UserRepository       repository.UserRepository
	DB                   *sql.DB
}

func NewFundraiserService(db *sql.DB) FundraiserService {
	fundraiserRepository := repository.NewFundraiserRepository(db)
	userRepository := repository.NewUserRepository(db)

	return &FundraiserServiceImpl{
		FundraiserRepository: fundraiserRepository,
		UserRepository:       userRepository,
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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Fundraiser with current user account already exists. Please wait for account approval."})
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

type ChangeFundraiserStatusRequest struct {
	IsActive bool `json:"is_active" binding:"required"`
}

type ChangeFundraiserStatusURI struct {
	ID int64 `uri:"id" binding:"required"`
}

func (service *FundraiserServiceImpl) ChangeFundraiserStatus(ctx *gin.Context) {
	var jsonReq ChangeFundraiserStatusRequest
	if err := ctx.ShouldBindJSON(&jsonReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide is_active status."})
		return
	}

	var uriReq ChangeFundraiserStatusURI
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide fundraiser ID."})
		return
	}

	checkFundraiserArg := repository.FundraiserIDParams{
		ID: uriReq.ID,
	}

	fundraiser, err := service.FundraiserRepository.GetOneByID(ctx, checkFundraiserArg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Fundraiser not found."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve fundraiser data. Please try again later."})
		return
	}

	updateFundraiserArg := repository.UpdateFundraiserParams{
		ID:       uriReq.ID,
		IsActive: jsonReq.IsActive,
	}

	err = service.FundraiserRepository.Update(ctx, updateFundraiserArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to change fundraiser status. Please try again later."})
		return
	}

	updateUserArg := repository.UpdateUserParams{
		ID:   fundraiser.UserID,
		Role: "fundraiser",
	}

	err = service.UserRepository.Update(ctx, updateUserArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Fundraiser status has been changed successfully."})
}

func (service *FundraiserServiceImpl) DeleteFundraiser(ctx *gin.Context) {

}