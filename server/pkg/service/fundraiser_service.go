package service

import "github.com/gin-gonic/gin"

type FundraiserService interface {
	CreateFundraiser(ctx *gin.Context)
}
