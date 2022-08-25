package service

import "github.com/gin-gonic/gin"

type WithdrawService interface {
	CreateWithdraw(ctx *gin.Context)
	GetCampaignWithdraw(ctx *gin.Context)
}
