package service

import "github.com/gin-gonic/gin"

type DonationService interface {
	CreateDonation(ctx *gin.Context)
	GetDonationHistory(ctx *gin.Context)
	GetCampaignDonation(ctx *gin.Context)
}
