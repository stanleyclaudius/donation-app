package service

import (
	"database/sql"
	"donation_app/pkg/repository"
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

func (service *WithdrawServiceImpl) GetCampaignWithdraw(ctx *gin.Context) {

}
