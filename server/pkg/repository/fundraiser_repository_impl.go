package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
)

type FundraiserRepositoryImpl struct {
	DB *sql.DB
}

func NewFundraiserRepository(db *sql.DB) FundraiserRepository {
	return &FundraiserRepositoryImpl{
		DB: db,
	}
}

type SaveFundraiserParams struct {
	UserID      int64  `json:"user_id"`
	Phone       string `json:"phone"`
	Address     string `json:"address"`
	Description string `json:"description"`
}

func (repository *FundraiserRepositoryImpl) Save(ctx context.Context, arg SaveFundraiserParams) (model.Fundraiser, error) {
	var fundraiser model.Fundraiser

	sqlStatement := "INSERT INTO fundraisers (user_id, phone, address, description) VALUES ($1, $2, $3, $4) RETURNING id, user_id, phone, address, description, is_active, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.UserID, arg.Phone, arg.Address, arg.Description)

	err := row.Scan(
		&fundraiser.ID,
		&fundraiser.UserID,
		&fundraiser.Phone,
		&fundraiser.Address,
		&fundraiser.Description,
		&fundraiser.IsActive,
		&fundraiser.CreatedAt,
	)

	return fundraiser, err
}

type GetFundraiserByUserIDParams struct {
	UserID int64 `json:"user_id"`
}

func (repository *FundraiserRepositoryImpl) GetOneByUserID(ctx context.Context, arg GetFundraiserByUserIDParams) (model.Fundraiser, error) {
	var fundraiser model.Fundraiser

	sqlStatement := "SELECT * FROM fundraisers WHERE user_id = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.UserID)

	err := row.Scan(
		&fundraiser.ID,
		&fundraiser.UserID,
		&fundraiser.Phone,
		&fundraiser.Address,
		&fundraiser.Description,
		&fundraiser.IsActive,
		&fundraiser.CreatedAt,
	)

	return fundraiser, err
}

type FundraiserIDParams struct {
	ID int64 `json:"id"`
}

func (repository *FundraiserRepositoryImpl) GetOneByID(ctx context.Context, arg FundraiserIDParams) (model.Fundraiser, error) {
	var fundraiser model.Fundraiser

	sqlStatement := "SELECT * FROM fundraisers WHERE id = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.ID)

	err := row.Scan(
		&fundraiser.ID,
		&fundraiser.UserID,
		&fundraiser.Phone,
		&fundraiser.Address,
		&fundraiser.Description,
		&fundraiser.IsActive,
		&fundraiser.CreatedAt,
	)

	return fundraiser, err
}

type UpdateFundraiserParams struct {
	ID       int64 `json:"id"`
	IsActive bool  `json:"is_active"`
}

func (repository *FundraiserRepositoryImpl) Update(ctx context.Context, arg UpdateFundraiserParams) error {
	sqlStatement := "UPDATE fundraisers SET is_active = $1 WHERE id = $2"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.IsActive, arg.ID)
	return err
}

func (repository *FundraiserRepositoryImpl) Delete(ctx context.Context, arg FundraiserIDParams) error {
	sqlStatement := "DELETE FROM fundraisers WHERE id = $1"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.ID)
	return err
}
