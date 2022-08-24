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

type CampaignIDParams struct {
	ID int64 `json:"id"`
}

func (repository *CampaignRepositoryImpl) GetOneByID(ctx context.Context, arg CampaignIDParams) (model.Campaign, error) {
	var campaign model.Campaign

	sqlStatement := "SELECT * FROM campaigns WHERE id = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.ID)

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

type GetOneCampaignByFundraiserParams struct {
	ID           int64 `json:"id"`
	FundraiserID int64 `json:"fundraiser_id"`
}

func (repository *CampaignRepositoryImpl) GetOneByFundraiserID(ctx context.Context, arg GetOneCampaignByFundraiserParams) (model.Campaign, error) {
	var campaign model.Campaign

	sqlStatement := "SELECT * FROM campaigns WHERE id = $1 AND fundraiser_id = $2"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.ID, arg.FundraiserID)

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

type GetManyCampaignParams struct {
	Limit  int64 `json:"limit"`
	Offset int64 `json:"offset"`
}

func (repository *CampaignRepositoryImpl) GetMany(ctx context.Context, arg GetManyCampaignParams) ([]model.Campaign, error) {
	sqlStatement := "SELECT * FROM campaigns"
	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM campaigns) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $1 OFFSET $2"
	}

	var rows *sql.Rows
	var err error

	if arg.Limit < 1 {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement)
	} else {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.Limit, arg.Offset)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	items := []model.Campaign{}

	for rows.Next() {
		var i model.Campaign

		if err := rows.Scan(
			&i.ID,
			&i.FundraiserID,
			&i.TypeID,
			&i.Title,
			&i.Description,
			&i.Image,
			&i.CollectedAmount,
			&i.TargetAmount,
			&i.WithdrawnAmount,
			&i.Slug,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}

		items = append(items, i)
	}

	if err := rows.Close(); err != nil {
		return nil, err
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}

type GetManyCampaignByFundraiserParams struct {
	FundraiserID int64 `json:"fundraiser_id"`
	Limit        int64 `json:"limit"`
	Offset       int64 `json:"offset"`
}

func (repository *CampaignRepositoryImpl) GetManyByFundraiser(ctx context.Context, arg GetManyCampaignByFundraiserParams) ([]model.Campaign, error) {
	sqlStatement := "SELECT * FROM campaigns WHERE fundraiser_id = $1"
	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM campaigns) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $2 OFFSET $3"
	}

	var rows *sql.Rows
	var err error

	if arg.Limit < 1 {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.FundraiserID)
	} else {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.FundraiserID, arg.Limit, arg.Offset)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	items := []model.Campaign{}

	for rows.Next() {
		var i model.Campaign

		if err := rows.Scan(
			&i.ID,
			&i.FundraiserID,
			&i.TypeID,
			&i.Title,
			&i.Description,
			&i.Image,
			&i.CollectedAmount,
			&i.TargetAmount,
			&i.WithdrawnAmount,
			&i.Slug,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}

		items = append(items, i)
	}

	if err := rows.Close(); err != nil {
		return nil, err
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, err
}

type DeleteCampaignParams struct {
	ID           int64 `json:"id"`
	FundraiserID int64 `json:"fundraiser_id"`
}

func (repository *CampaignRepositoryImpl) Delete(ctx context.Context, arg DeleteCampaignParams) error {
	sqlStatement := "DELETE FROM campaigns WHERE id = $1 AND fundraiser_id = $2"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.ID, arg.FundraiserID)
	return err
}

type UpdateCampaignParams struct {
	ID           int64   `json:"id"`
	TypeID       int64   `json:"type_id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	Image        string  `json:"image"`
	TargetAmount float64 `json:"target_amount"`
	Slug         string  `json:"slug"`
}

func (repository *CampaignRepositoryImpl) Update(ctx context.Context, arg UpdateCampaignParams) (model.Campaign, error) {
	var campaign model.Campaign

	sqlStatement := "UPDATE campaigns SET type_id = $1, title = $2, description = $3, image = $4, target_amount = $5, slug = $6 WHERE id = $7 RETURNING id, fundraiser_id, type_id, title, description, image, collected_amount, target_amount, withdrawn_amount, slug, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.TypeID, arg.Title, arg.Description, arg.Image, arg.TargetAmount, arg.Slug, arg.ID)

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
