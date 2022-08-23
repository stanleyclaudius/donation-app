package service

import "github.com/gin-gonic/gin"

type TypeService interface {
	CreateType(ctx *gin.Context)
	GetAllTypes(ctx *gin.Context)
	UpdateType(ctx *gin.Context)
	DeleteType(ctx *gin.Context)
}
