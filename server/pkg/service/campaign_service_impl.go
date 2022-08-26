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
	TypeRepository     repository.TypeRepository
	DB                 *sql.DB
}

func NewCampaignService(db *sql.DB) CampaignService {
	campaignRepository := repository.NewCampaignRepository(db)
	typeRepository := repository.NewTypeRepository(db)

	return &CampaignServiceImpl{
		CampaignRepository: campaignRepository,
		TypeRepository:     typeRepository,
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

	checkTypeArg := repository.TypeIDParams{
		ID: req.TypeID,
	}

	campaignType, err := service.TypeRepository.GetOneByID(ctx, checkTypeArg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Campaign type not found."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign type data. Please try again later."})
		return
	}

	checkCampaignArg := repository.CampaignSlugParams{
		Slug: strings.Replace(strings.ToLower(req.Title), " ", "-", -1),
	}

	_, err = service.CampaignRepository.GetOneBySlug(ctx, checkCampaignArg)
	if err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Campaign title has been used before."})
		return
	}

	saveCampaignArg := repository.SaveCampaignParams{
		FundraiserID: fundraiserID,
		TypeID:       req.TypeID,
		Title:        req.Title,
		Description:  req.Description,
		Image:        req.Image,
		TargetAmount: req.TargetAmount,
		Slug:         strings.Replace(strings.ToLower(req.Title), " ", "-", -1),
	}

	campaign, err := service.CampaignRepository.Save(ctx, saveCampaignArg)
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

	ctx.JSON(http.StatusOK, gin.H{"campaign": campaign, "type": campaignType.Title, "type_id": campaignType.ID})
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

type GetCampaignsQueryString struct {
	Page  int64 `form:"page"`
	Limit int64 `form:"limit"`
}

func (service *CampaignServiceImpl) GetCampaigns(ctx *gin.Context) {
	var req GetCampaignsQueryString
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide page and limit as query string."})
		return
	}

	arg := repository.GetManyCampaignParams{
		Limit:  req.Limit,
		Offset: (req.Page - 1) * req.Limit,
	}

	campaigns, campaignCount, err := service.CampaignRepository.GetMany(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaigns data. Please try again later."})
		return
	}

	totalPage := 0
	if arg.Limit != 0 {
		if campaignCount%arg.Limit == 0 {
			totalPage = int(campaignCount / arg.Limit)
		} else {
			totalPage = int(campaignCount/arg.Limit) + 1
		}
	} else {
		totalPage = 1
	}

	ctx.JSON(http.StatusOK, gin.H{"campaigns": campaigns, "total_page": totalPage})
}

func (service *CampaignServiceImpl) GetFundraiserCampaigns(ctx *gin.Context) {
	fundraiserID := ctx.MustGet("fundraiser_id").(int64)

	var req GetCampaignsQueryString
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide page and limit as query string."})
		return
	}

	arg := repository.GetManyCampaignByFundraiserParams{
		FundraiserID: fundraiserID,
		Limit:        req.Limit,
		Offset:       (req.Page - 1) * req.Limit,
	}

	campaigns, campaignCount, err := service.CampaignRepository.GetManyByFundraiser(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve fundraiser campaigns data. Please try again later."})
	}

	totalPage := 0
	if arg.Limit != 0 {
		if campaignCount%arg.Limit == 0 {
			totalPage = int(campaignCount / arg.Limit)
		} else {
			totalPage = int(campaignCount/arg.Limit) + 1
		}
	} else {
		totalPage = 1
	}

	ctx.JSON(http.StatusOK, gin.H{"campaigns": campaigns, "total_page": totalPage})
}

func (service *CampaignServiceImpl) DeleteCampaign(ctx *gin.Context) {
	fundraiserID := ctx.MustGet("fundraiser_id").(int64)

	var req CampaignIDURI
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide campaign ID."})
		return
	}

	checkCampaignArg := repository.GetOneCampaignByFundraiserParams{
		ID:           req.ID,
		FundraiserID: fundraiserID,
	}

	_, err := service.CampaignRepository.GetOneByFundraiserID(ctx, checkCampaignArg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Campaign is not belong to current authenticated fundraiser."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign data. Please try again later."})
		return
	}

	deleteCampaignArg := repository.DeleteCampaignParams{
		ID:           req.ID,
		FundraiserID: fundraiserID,
	}

	err = service.CampaignRepository.Delete(ctx, deleteCampaignArg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Campaign has been deleted successfully."})
}

type UpdateCampaignRequest struct {
	TypeID       int64   `json:"type_id" binding:"required"`
	Title        string  `json:"title" binding:"required"`
	Description  string  `json:"description" binding:"required"`
	Image        string  `json:"image" binding:"required"`
	TargetAmount float64 `json:"target_amount" binding:"required"`
}

func (service *CampaignServiceImpl) UpdateCampaign(ctx *gin.Context) {
	fundraiserID := ctx.MustGet("fundraiser_id").(int64)
	var jsonReq UpdateCampaignRequest
	if err := ctx.ShouldBindJSON(&jsonReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to update campaign."})
		return
	}

	var uriReq CampaignIDURI
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide campaign ID."})
		return
	}

	checkTypeArg := repository.TypeIDParams{
		ID: jsonReq.TypeID,
	}

	campaignType, err := service.TypeRepository.GetOneByID(ctx, checkTypeArg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Campaign type not found."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign type data. Please try again later."})
		return
	}

	checkCampaignArg := repository.GetOneCampaignByFundraiserParams{
		ID:           uriReq.ID,
		FundraiserID: fundraiserID,
	}

	_, err = service.CampaignRepository.GetOneByFundraiserID(ctx, checkCampaignArg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Campaign is not belong to current authenticated fundraiser."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign data. Please try again later."})
		return
	}

	updateCampaignArg := repository.UpdateCampaignParams{
		ID:           uriReq.ID,
		TypeID:       jsonReq.TypeID,
		Title:        jsonReq.Title,
		Description:  jsonReq.Description,
		Image:        jsonReq.Image,
		TargetAmount: jsonReq.TargetAmount,
		Slug:         strings.Replace(strings.ToLower(jsonReq.Title), " ", "-", -1),
	}

	campaign, err := service.CampaignRepository.Update(ctx, updateCampaignArg)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Campaign title has been used before."})
				return
			}
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update campaign. Please try again later."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"campaign": campaign, "type": campaignType.Title, "type_id": campaignType.ID})
}
