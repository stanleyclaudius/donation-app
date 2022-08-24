package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"donation_app/pkg/token"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DonationServiceImpl struct {
	DonationRepository repository.DonationRepository
	CampaignRepository repository.CampaignRepository
	DB                 *sql.DB
}

func NewDonationService(db *sql.DB) DonationService {
	donationRepository := repository.NewDonationRepository(db)
	campaignRepository := repository.NewCampaignRepository(db)

	return &DonationServiceImpl{
		DonationRepository: donationRepository,
		CampaignRepository: campaignRepository,
		DB:                 db,
	}
}

type CreateDonationRequest struct {
	CampaignID  int64   `json:"campaign_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
	Words       string  `json:"words" binding:"required"`
	IsAnonymous bool    `json:"is_anonymous"`
}

func (service *DonationServiceImpl) CreateDonation(ctx *gin.Context) {
	authPayload := ctx.MustGet("authorization_payload").(*token.Payload)

	var req CreateDonationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to donate."})
		return
	}

	checkCampaignArg := repository.CampaignIDParams{
		ID: req.CampaignID,
	}

	campaign, err := service.CampaignRepository.GetOneByID(ctx, checkCampaignArg)
	if err != nil {
		if err == sql.ErrNoRows {
			err := fmt.Errorf("campaign with id %d not found", req.CampaignID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign data. Please try again later."})
		return
	}

	createDonationArg := repository.SaveDonationParams{
		UserID:      authPayload.UserID,
		CampaignID:  req.CampaignID,
		Amount:      req.Amount,
		Words:       req.Words,
		IsAnonymous: req.IsAnonymous,
	}

	donation, err := service.DonationRepository.Save(ctx, createDonationArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to donate. Please try again later."})
		return
	}

	updateCollectedAmountArg := repository.UpdateCollectedAmountParams{
		CampaignID: req.CampaignID,
		Amount:     req.Amount + campaign.CollectedAmount,
	}

	err = service.CampaignRepository.UpdateCollectedAmount(ctx, updateCollectedAmountArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update campaign collected amount. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"donation": donation})
}

func (service *DonationServiceImpl) GetDonationHistory(ctx *gin.Context) {

}

func (service *DonationServiceImpl) GetCampaignDonation(ctx *gin.Context) {

}
