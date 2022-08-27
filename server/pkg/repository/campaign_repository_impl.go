package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
	"time"
)

type CampaignRepositoryImpl struct {
	DB *sql.DB
}

func NewCampaignRepository(db *sql.DB) CampaignRepository {
	return &CampaignRepositoryImpl{
		DB: db,
	}
}

type JoinedCampaignData struct {
	ID                    int64     `json:"id"`
	Type                  string    `json:"type"`
	TypeID                int64     `json:"type_id"`
	FundraiserName        string    `json:"fundraiser_name"`
	FundraiserPhone       string    `json:"fundraiser_phone"`
	FundraiserAddress     string    `json:"fundraiser_address"`
	FundraiserDescription string    `json:"fundraiser_description"`
	Title                 string    `json:"title"`
	Description           string    `json:"description"`
	Image                 string    `json:"image"`
	CollectedAmount       float64   `json:"collected_amount"`
	TargetAmount          float64   `json:"target_amount"`
	WithdrawnAmount       float64   `json:"withdrawn_amount"`
	Slug                  string    `json:"slug"`
	CreatedAt             time.Time `json:"created_at"`
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

type CampaignSlugParams struct {
	Slug string `json:"slug"`
}

func (repository *CampaignRepositoryImpl) GetOneBySlug(ctx context.Context, arg CampaignSlugParams) (JoinedCampaignData, error) {
	var campaign JoinedCampaignData

	sqlStatement := "SELECT C.id, T.title as type, T.id as type_id, U.name AS fundraiser_name, F.phone AS fundraiser_phone, F.address AS fundraiser_address, F.description AS fundraiser_description, C.title, C.description, C.image, C.collected_amount, C.target_amount, C.withdrawn_amount, C.slug, C.created_at FROM campaigns C JOIN fundraisers F ON C.fundraiser_id = F.id JOIN types T ON c.type_id = T.id JOIN users U ON F.user_id = U.id WHERE slug = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.Slug)

	err := row.Scan(
		&campaign.ID,
		&campaign.Type,
		&campaign.TypeID,
		&campaign.FundraiserName,
		&campaign.FundraiserPhone,
		&campaign.FundraiserAddress,
		&campaign.FundraiserDescription,
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

type CampaignCount struct {
	CampaignCount int64 `json:"campaign_count"`
}

func (repository *CampaignRepositoryImpl) GetMany(ctx context.Context, arg GetManyCampaignParams) ([]model.Campaign, int64, error) {
	sqlStatement := "SELECT * FROM campaigns ORDER BY id DESC"
	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM campaigns) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $1 OFFSET $2"
	}

	var campaignCount CampaignCount
	var rows *sql.Rows
	var err error

	if arg.Limit < 1 {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement)
	} else {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.Limit, arg.Offset)
	}

	if err != nil {
		return nil, 0, err
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
			return nil, 0, err
		}

		items = append(items, i)
	}

	sqlStatement = "SELECT COUNT(1) AS campaign_count FROM campaigns"
	row := repository.DB.QueryRowContext(ctx, sqlStatement)

	err = row.Scan(
		&campaignCount.CampaignCount,
	)

	if err != nil {
		return nil, 0, err
	}

	if err := rows.Close(); err != nil {
		return nil, 0, err
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return items, campaignCount.CampaignCount, nil
}

type GetManyCampaignByFundraiserParams struct {
	FundraiserID int64 `json:"fundraiser_id"`
	Limit        int64 `json:"limit"`
	Offset       int64 `json:"offset"`
}

func (repository *CampaignRepositoryImpl) GetManyByFundraiser(ctx context.Context, arg GetManyCampaignByFundraiserParams) ([]JoinedCampaignData, int64, error) {
	sqlStatement := "SELECT C.id, T.title as type, T.id as type_id, U.name AS fundraiser_name, F.phone AS fundraiser_phone, F.address AS fundraiser_address, F.description AS fundraiser_description, C.title, C.description, C.image, C.collected_amount, C.target_amount, C.withdrawn_amount, C.slug, C.created_at FROM campaigns C JOIN fundraisers F ON C.fundraiser_id = F.id JOIN types T ON c.type_id = T.id JOIN users U ON F.user_id = U.id WHERE fundraiser_id = $1 ORDER BY id DESC"
	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM campaigns WHERE fundraiser_id = $1) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $2 OFFSET $3"
	}

	var campaignCount CampaignCount
	var rows *sql.Rows
	var err error

	if arg.Limit < 1 {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.FundraiserID)
	} else {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.FundraiserID, arg.Limit, arg.Offset)
	}

	if err != nil {
		return nil, 0, err
	}

	defer rows.Close()

	items := []JoinedCampaignData{}

	for rows.Next() {
		var i JoinedCampaignData

		if err := rows.Scan(
			&i.ID,
			&i.Type,
			&i.TypeID,
			&i.FundraiserName,
			&i.FundraiserPhone,
			&i.FundraiserAddress,
			&i.FundraiserDescription,
			&i.Title,
			&i.Description,
			&i.Image,
			&i.CollectedAmount,
			&i.TargetAmount,
			&i.WithdrawnAmount,
			&i.Slug,
			&i.CreatedAt,
		); err != nil {
			return nil, 0, err
		}

		items = append(items, i)
	}

	sqlStatement = "SELECT COUNT(1) AS campaign_count FROM campaigns WHERE fundraiser_id = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.FundraiserID)

	err = row.Scan(
		&campaignCount.CampaignCount,
	)

	if err := rows.Close(); err != nil {
		return nil, 0, err
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return items, campaignCount.CampaignCount, err
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

type UpdateAmountParams struct {
	CampaignID int64   `json:"campaign_id"`
	Amount     float64 `json:"amount"`
}

func (repository *CampaignRepositoryImpl) UpdateCollectedAmount(ctx context.Context, arg UpdateAmountParams) error {
	sqlStatement := "UPDATE campaigns SET collected_amount = $1 WHERE id = $2"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.Amount, arg.CampaignID)
	return err
}

func (repository *CampaignRepositoryImpl) UpdateWithdrawnAmount(ctx context.Context, arg UpdateAmountParams) error {
	sqlStatement := "UPDATE campaigns SET withdrawn_amount = $1 WHERE id = $2"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.Amount, arg.CampaignID)
	return err
}
