package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"fmt"
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

type GetAllTypesQueryString struct {
	Page  int64 `form:"page"`
	Limit int64 `form:"limit"`
}

func (service *TypeServiceImpl) GetAllTypes(ctx *gin.Context) {
	var req GetAllTypesQueryString
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide page and limit as query string."})
		return
	}

	arg := repository.GetManyTypeParams{
		Limit:  req.Limit,
		Offset: (req.Page - 1) * req.Limit,
	}

	types, err := service.TypeRepository.GetMany(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign types. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"types": types})
}

type UpdateTypeRequest struct {
	Title string `json:"title" binding:"required"`
}

type TypeIDURI struct {
	ID int64 `uri:"id" binding:"required"`
}

func (service *TypeServiceImpl) UpdateType(ctx *gin.Context) {
	var jsonReq UpdateTypeRequest
	if err := ctx.ShouldBindJSON(&jsonReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide type title."})
		return
	}

	var uriReq TypeIDURI
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide type ID."})
		return
	}

	checkTypeArg := repository.TypeIDParams{
		ID: uriReq.ID,
	}

	_, err := service.TypeRepository.GetOneByID(ctx, checkTypeArg)
	if err != nil {
		if err == sql.ErrNoRows {
			err := fmt.Errorf("campaign type with id %d not found", uriReq.ID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign type data. Please try again later."})
		return
	}

	updateTypeArg := repository.UpdateTypeParams{
		ID:    uriReq.ID,
		Title: jsonReq.Title,
	}

	campaignType, err := service.TypeRepository.Update(ctx, updateTypeArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update type. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"type": campaignType})
}

func (service *TypeServiceImpl) DeleteType(ctx *gin.Context) {
	var req TypeIDURI
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide campaign type ID."})
		return
	}

	arg := repository.TypeIDParams{
		ID: req.ID,
	}

	_, err := service.TypeRepository.GetOneByID(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			err := fmt.Errorf("campaign type with id %d not found", req.ID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign type data. Please try again later."})
		return
	}

	err = service.TypeRepository.Delete(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete campaign type. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Campaign type has been deleted successfully."})
}
