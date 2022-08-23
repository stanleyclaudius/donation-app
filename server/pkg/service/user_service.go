package service

import "github.com/gin-gonic/gin"

type UserService interface {
	Register(ctx *gin.Context)
	Login(ctx *gin.Context)
	Logout(ctx *gin.Context)
}
