package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
)

type TypeRepositoryImpl struct {
	DB *sql.DB
}

func NewTypeRepository(db *sql.DB) TypeRepository {
	return &TypeRepositoryImpl{
		DB: db,
	}
}

type SaveTypeParams struct {
	Title string `json:"title"`
}

func (repository *TypeRepositoryImpl) Save(ctx context.Context, arg SaveTypeParams) (model.Type, error) {
	var campaignType model.Type

	sqlStatement := "INSERT INTO types (title) VALUES ($1) RETURNING id, title, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.Title)

	err := row.Scan(
		&campaignType.ID,
		&campaignType.Title,
		&campaignType.CreatedAt,
	)

	return campaignType, err
}
