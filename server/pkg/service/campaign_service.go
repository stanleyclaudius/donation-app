package service

import "github.com/gin-gonic/gin"

type CampaignService interface {
	CreateCampaign(ctx *gin.Context)
}
