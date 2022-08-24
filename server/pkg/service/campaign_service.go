package service

import "github.com/gin-gonic/gin"

type CampaignService interface {
	CreateCampaign(ctx *gin.Context)
	GetCampaign(ctx *gin.Context)
	GetCampaigns(ctx *gin.Context)
	GetFundraiserCampaigns(ctx *gin.Context)
	DeleteCampaign(ctx *gin.Context)
}
