package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
)

type CampaignRepositoryImpl struct {
	DB *sql.DB
}

func NewCampaignRepository(db *sql.DB) CampaignRepository {
	return &CampaignRepositoryImpl{
		DB: db,
	}
}

type SaveCampaignParams struct {
	FundraiserID int64   `json:"fundraiser_id"`
	TypeID       int64   `json:"type_id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	Image        string  `json:"image"`
	TargetAmount float64 `json:"target_amount"`
	Slug         string  `json:"slug"`
}

func (repository *CampaignRepositoryImpl) Save(ctx context.Context, arg SaveCampaignParams) (model.Campaign, error) {
	var campaign model.Campaign

	sqlStatement := "INSERT INTO campaigns (fundraiser_id, type_id, title, description, image, target_amount, slug) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, fundraiser_id, type_id, title, description, image, collected_amount, target_amount, withdrawn_amount, slug, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.FundraiserID, arg.TypeID, arg.Title, arg.Description, arg.Image, arg.TargetAmount, arg.Slug)

	err := row.Scan(
		&campaign.ID,
		&campaign.FundraiserID,
		&campaign.TypeID,
		&campaign.Title,
		&campaign.Description,
		&campaign.Image,
		&campaign.CollectedAmount,
		&campaign.TargetAmount,
		&campaign.WithdrawnAmount,
		&campaign.Slug,
		&campaign.CreatedAt,
	)

	return campaign, err
}
