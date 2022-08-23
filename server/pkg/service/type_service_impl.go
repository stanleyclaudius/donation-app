package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TypeServiceImpl struct {
	TypeRepository repository.TypeRepository
	DB             *sql.DB
}

func NewTypeService(db *sql.DB) TypeService {
	typeRepository := repository.NewTypeRepository(db)

	return &TypeServiceImpl{
		TypeRepository: typeRepository,
		DB:             db,
	}
}

type CreateTypeRequest struct {
	Title string `json:"title" binding:"required"`
}

func (service *TypeServiceImpl) CreateType(ctx *gin.Context) {
	var req CreateTypeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide type title."})
		return
	}

	arg := repository.SaveTypeParams{
		Title: req.Title,
	}

	campaignType, err := service.TypeRepository.Save(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create campaign type. Please try agian later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"type": campaignType})
}
