package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type CampaignServiceImpl struct {
	CampaignRepository repository.CampaignRepository
	DB                 *sql.DB
}

func NewCampaignService(db *sql.DB) CampaignService {
	campaignRepository := repository.NewCampaignRepository(db)

	return &CampaignServiceImpl{
		CampaignRepository: campaignRepository,
		DB:                 db,
	}
}

type CreateCampaignRequest struct {
	TypeID       int64   `json:"type_id" binding:"required"`
	Title        string  `json:"title" binding:"required"`
	Description  string  `json:"description" binding:"required"`
	Image        string  `json:"image" binding:"required"`
	TargetAmount float64 `json:"target_amount" binding:"required"`
}

func (service *CampaignServiceImpl) CreateCampaign(ctx *gin.Context) {
	fundraiserID := ctx.MustGet("fundraiser_id").(int64)

	var req CreateCampaignRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to create campaign."})
		return
	}

	arg := repository.SaveCampaignParams{
		FundraiserID: fundraiserID,
		TypeID:       req.TypeID,
		Title:        req.Title,
		Description:  req.Description,
		Image:        req.Image,
		TargetAmount: req.TargetAmount,
		Slug:         strings.Replace(strings.ToLower(req.Title), " ", "-", -1),
	}

	campaign, err := service.CampaignRepository.Save(ctx, arg)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				err := fmt.Errorf("campaign with title %s already exists", req.Title)
				ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create campaign. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"campaign": campaign})
}

type CampaignIDURI struct {
	ID int64 `uri:"id" binding:"required"`
}

func (service *CampaignServiceImpl) GetCampaign(ctx *gin.Context) {
	var req CampaignIDURI
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide campaign ID."})
		return
	}

	arg := repository.CampaignIDParams{
		ID: req.ID,
	}

	campaign, err := service.CampaignRepository.GetOneByID(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			err := fmt.Errorf("campaign with id %d not found", req.ID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign data. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"campaign": campaign})
}

type GetCampaignsRequest struct {
	Page  int64 `form:"page"`
	Limit int64 `form:"limit"`
}

func (service *CampaignServiceImpl) GetCampaigns(ctx *gin.Context) {
	var req GetCampaignsRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide page and limit as query string."})
		return
	}

	arg := repository.GetManyCampaignParams{
		Limit:  req.Limit,
		Offset: (req.Page - 1) * req.Limit,
	}

	campaigns, err := service.CampaignRepository.GetMany(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaigns data. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"campaigns": campaigns})
}

func (service *CampaignServiceImpl) GetFundraiserCampaigns(ctx *gin.Context) {
	fundraiserID := ctx.MustGet("fundraiser_id").(int64)

	var req GetCampaignsRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide page and limit as query string."})
		return
	}

	arg := repository.GetManyCampaignByFundraiserParams{
		FundraiserID: fundraiserID,
		Limit:        req.Limit,
		Offset:       (req.Page - 1) * req.Limit,
	}

	campaigns, err := service.CampaignRepository.GetManyByFundraiser(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve fundraiser campaigns data. Please try again later."})
	}

	ctx.JSON(http.StatusOK, gin.H{"campaigns": campaigns})
}
