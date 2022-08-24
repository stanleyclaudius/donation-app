package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
)

type WithdrawRepositoryImpl struct {
	DB *sql.DB
}

func NewWithdrawRepository(db *sql.DB) WithdrawRepository {
	return &WithdrawRepositoryImpl{
		DB: db,
	}
}

type SaveWithdrawParams struct {
	CampaignID int64   `json:"campaign_id"`
	Amount     float64 `json:"amount"`
}

func (repository *WithdrawRepositoryImpl) Save(ctx context.Context, arg SaveWithdrawParams) (model.Withdraw, error) {
	var withdraw model.Withdraw

	sqlStatement := "INSERT INTO withdrawn (campaign_id, amount) VALUES ($1, $2) RETURNING id, campaign_id, amount, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.CampaignID, arg.Amount)

	err := row.Scan(
		&withdraw.ID,
		&withdraw.CampaignID,
		&withdraw.Amount,
		&withdraw.CreatedAt,
	)

	return withdraw, err
}

type GetManyWithdrawByCampaignParams struct {
	CampaignID int64 `json:"campaign_id"`
	Limit      int64 `json:"limit"`
	Offset     int64 `json:"offset"`
}

func (repository *WithdrawRepositoryImpl) GetManyByCampaign(ctx context.Context, arg GetManyWithdrawByCampaignParams) ([]model.Withdraw, error) {
	sqlStatement := "SELECT * FROM withdrawn WHERE campaign_id = $1"

	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM withdrawn WHERE campaign_id = $1) OFFSET 0"
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

	items := []model.Withdraw{}

	for rows.Next() {
		var i model.Withdraw

		if err := rows.Scan(
			&i.ID,
			&i.CampaignID,
			&i.Amount,
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
