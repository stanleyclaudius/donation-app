package service

import "github.com/gin-gonic/gin"

type FundraiserService interface {
	CreateFundraiser(ctx *gin.Context)
	GetAllFundraisers(ctx *gin.Context)
	ChangeFundraiserStatus(ctx *gin.Context)
	DeleteFundraiser(ctx *gin.Context)
}
