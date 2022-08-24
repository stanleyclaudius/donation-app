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
