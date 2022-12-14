package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
	"time"
)

type FundraiserRepositoryImpl struct {
	DB *sql.DB
}

func NewFundraiserRepository(db *sql.DB) FundraiserRepository {
	return &FundraiserRepositoryImpl{
		DB: db,
	}
}

type JoinedFundraiserData struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	Name        string    `json:"name"`
	Avatar      string    `json:"avatar"`
	Email       string    `json:"email"`
	Phone       string    `json:"phone"`
	Address     string    `json:"address"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
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

type GetManyFundraiserParams struct {
	Limit  int64 `json:"limit"`
	Offset int64 `json:"offset"`
}

type FundraiserCount struct {
	FundraiserCount int64 `json:"fundraiser_count"`
}

func (repository *FundraiserRepositoryImpl) GetMany(ctx context.Context, arg GetManyFundraiserParams) ([]JoinedFundraiserData, int64, error) {
	sqlStatement := "SELECT F.id, F.user_id, U.name AS name, U.avatar AS avatar, U.email AS email, F.phone AS phone, F.address AS address, F.description AS description, F.created_at AS created_at FROM fundraisers F JOIN users U ON F.user_id = U.id WHERE is_active = false"
	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM fundraisers WHERE is_active = false) OFFSET 0"
	} else {
		sqlStatement += " LIMIT $1 OFFSET $2"
	}

	var fundraiserCount FundraiserCount
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

	items := []JoinedFundraiserData{}

	for rows.Next() {
		var i JoinedFundraiserData

		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Name,
			&i.Avatar,
			&i.Email,
			&i.Phone,
			&i.Address,
			&i.Description,
			&i.CreatedAt,
		); err != nil {
			return nil, 0, err
		}

		items = append(items, i)
	}

	sqlStatement = "SELECT COUNT(1) FROM fundraisers WHERE is_active = false"
	row := repository.DB.QueryRowContext(ctx, sqlStatement)

	err = row.Scan(
		&fundraiserCount.FundraiserCount,
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

	return items, fundraiserCount.FundraiserCount, nil
}

type UpdateFundraiserStatusParams struct {
	ID       int64 `json:"id"`
	IsActive bool  `json:"is_active"`
}

func (repository *FundraiserRepositoryImpl) UpdateStatus(ctx context.Context, arg UpdateFundraiserStatusParams) error {
	sqlStatement := "UPDATE fundraisers SET is_active = $1 WHERE id = $2"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.IsActive, arg.ID)
	return err
}

func (repository *FundraiserRepositoryImpl) Delete(ctx context.Context, arg FundraiserIDParams) error {
	sqlStatement := "DELETE FROM fundraisers WHERE id = $1"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.ID)
	return err
}
