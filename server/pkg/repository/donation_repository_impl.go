package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
	"time"
)

type DonationRepositoryImpl struct {
	DB *sql.DB
}

func NewDonationRepository(db *sql.DB) DonationRepository {
	return &DonationRepositoryImpl{
		DB: db,
	}
}

type JoinedDonationData struct {
	ID          int64     `json:"id"`
	Avatar      string    `json:"avatar"`
	Name        string    `json:"name"`
	Amount      float64   `json:"amount"`
	Words       string    `json:"words"`
	IsAnonymous bool      `json:"is_anonymous"`
	CreatedAt   time.Time `json:"created_at"`
}

type SaveDonationParams struct {
	UserID      int64   `json:"user_id"`
	CampaignID  int64   `json:"campaign_id"`
	Amount      float64 `json:"amount"`
	Words       string  `json:"words"`
	IsAnonymous bool    `json:"is_anonymous"`
}

func (repository *DonationRepositoryImpl) Save(ctx context.Context, arg SaveDonationParams) (model.Donation, error) {
	var donation model.Donation

	sqlStatement := "INSERT INTO donations (user_id, campaign_id, amount, words, is_anonymous) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, campaign_id, amount, words, is_anonymous, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.UserID, arg.CampaignID, arg.Amount, arg.Words, arg.IsAnonymous)

	err := row.Scan(
		&donation.ID,
		&donation.UserID,
		&donation.CampaignID,
		&donation.Amount,
		&donation.Words,
		&donation.IsAnonymous,
		&donation.CreatedAt,
	)

	return donation, err
}

type GetManyDonationByUserParams struct {
	UserID int64 `json:"user_id"`
	Limit  int64 `json:"limit"`
	Offset int64 `json:"offset"`
}

func (repository *DonationRepositoryImpl) GetManyByUser(ctx context.Context, arg GetManyDonationByUserParams) ([]model.Donation, error) {
	sqlStatement := "SELECT * FROM donations WHERE user_id = $1"

	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM donations WHERE user_id = $1) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $2 OFFSET $3"
	}

	var rows *sql.Rows
	var err error

	if arg.Limit < 1 {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.UserID)
	} else {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.UserID, arg.Limit, arg.Offset)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	items := []model.Donation{}

	for rows.Next() {
		var i model.Donation

		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.CampaignID,
			&i.Amount,
			&i.Words,
			&i.IsAnonymous,
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

type GetManyDonationByCampaignParams struct {
	CampaignID int64 `json:"campaign_id"`
	Limit      int64 `json:"limit"`
	Offset     int64 `json:"offset"`
}

func (repository *DonationRepositoryImpl) GetManyByCampaign(ctx context.Context, arg GetManyDonationByCampaignParams) ([]JoinedDonationData, error) {
	sqlStatement := "SELECT D.id, U.avatar, U.name, D.amount, D.words, D.is_anonymous, D.created_at FROM donations D JOIN users U ON D.user_id = U.id WHERE campaign_id = $1 ORDER BY id DESC"

	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM donations WHERE campaign_id = $1) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $2 OFFSET $3"
	}

	var rows *sql.Rows
	var err error

	if arg.Limit < 1 {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.CampaignID)
	} else {
		rows, err = repository.DB.QueryContext(ctx, sqlStatement, arg.CampaignID, arg.Limit, arg.Offset)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	items := []JoinedDonationData{}

	for rows.Next() {
		var i JoinedDonationData

		if err := rows.Scan(
			&i.ID,
			&i.Avatar,
			&i.Name,
			&i.Amount,
			&i.Words,
			&i.IsAnonymous,
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
