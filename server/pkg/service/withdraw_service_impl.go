package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type WithdrawServiceImpl struct {
	WithdrawRepository repository.WithdrawRepository
	CampaignRepository repository.CampaignRepository
	DB                 *sql.DB
}

func NewWithdrawService(db *sql.DB) WithdrawService {
	withdrawRepository := repository.NewWithdrawRepository(db)
	campaignRepository := repository.NewCampaignRepository(db)

	return &WithdrawServiceImpl{
		WithdrawRepository: withdrawRepository,
		CampaignRepository: campaignRepository,
		DB:                 db,
	}
}

type CreateWithdrawRequest struct {
	CampaignID int64   `json:"campaign_id" binding:"required"`
	Amount     float64 `json:"amount"`
}

func (service *WithdrawServiceImpl) CreateWithdraw(ctx *gin.Context) {
	fundraiserID := ctx.MustGet("fundraiser_id").(int64)

	var req CreateWithdrawRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to create withdraw."})
		return
	}

	checkCampaignArg := repository.GetOneCampaignByFundraiserParams{
		ID:           req.CampaignID,
		FundraiserID: fundraiserID,
	}

	campaign, err := service.CampaignRepository.GetOneByFundraiserID(ctx, checkCampaignArg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "There's no campaign found with provided id and current authenticated fundraiser."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign data. Please try again later."})
		return
	}

	if req.Amount > campaign.CollectedAmount-campaign.WithdrawnAmount {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid withdraw amount."})
		return
	}

	createWithdrawArg := repository.SaveWithdrawParams{
		CampaignID: req.CampaignID,
		Amount:     req.Amount,
	}

	_, err = service.WithdrawRepository.Save(ctx, createWithdrawArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create withdraw. Please try again later."})
		return
	}

	updateAmountArg := repository.UpdateAmountParams{
		CampaignID: req.CampaignID,
		Amount:     campaign.WithdrawnAmount + req.Amount,
	}

	err = service.CampaignRepository.UpdateWithdrawnAmount(ctx, updateAmountArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update campaign withdrawn amount. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Withdraw has been done successfully."})
}

type GetCampaignWithdrawURI struct {
	CampaignID int64 `uri:"campaign_id" binding:"required"`
}

type GetCampaignWithdrawQueryString struct {
	Page  int64 `json:"page"`
	Limit int64 `json:"limit"`
}

func (service *WithdrawServiceImpl) GetCampaignWithdraw(ctx *gin.Context) {
	var uriReq GetCampaignWithdrawURI
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide campaign ID."})
		return
	}

	var queryReq GetCampaignWithdrawQueryString
	if err := ctx.ShouldBindQuery(&queryReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide page and limit as query string."})
		return
	}

	checkCampaignArg := repository.CampaignIDParams{
		ID: uriReq.CampaignID,
	}

	_, err := service.CampaignRepository.GetOneByID(ctx, checkCampaignArg)
	if err != nil {
		if err == sql.ErrNoRows {
			err := fmt.Errorf("campaign with id %d not found", uriReq.CampaignID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign data. Please try again later."})
		return
	}

	getWithdrawArg := repository.GetManyWithdrawByCampaignParams{
		CampaignID: uriReq.CampaignID,
		Limit:      queryReq.Limit,
		Offset:     (queryReq.Page - 1) * queryReq.Limit,
	}

	withdraws, err := service.WithdrawRepository.GetManyByCampaign(ctx, getWithdrawArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaigns data. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"withdraws": withdraws})
}
