package service

import "github.com/gin-gonic/gin"

type TypeService interface {
	CreateType(ctx *gin.Context)
}
