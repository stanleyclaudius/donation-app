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

func (repository *TypeRepositoryImpl) GetOneByID(ctx context.Context, arg DeleteTypeParams) (model.Type, error) {
	var campaignType model.Type

	sqlStatement := "SELECT * FROM types WHERE id = $1 LIMIT 1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.ID)

	err := row.Scan(
		&campaignType.ID,
		&campaignType.Title,
		&campaignType.CreatedAt,
	)

	return campaignType, err
}

type GetManyTypeParams struct {
	Limit  int64 `json:"limit"`
	Offset int64 `json:"offset"`
}

func (repository *TypeRepositoryImpl) GetMany(ctx context.Context, arg GetManyTypeParams) ([]model.Type, error) {
	sqlStatement := "SELECT * FROM types"
	if arg.Limit < 1 {
		sqlStatement += " LIMIT (SELECT COUNT(id) FROM types) OFFSET 0"
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

	items := []model.Type{}

	for rows.Next() {
		var i model.Type

		if err := rows.Scan(
			&i.ID,
			&i.Title,
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

type UpdateTypeParams struct {
	ID    int64  `json:"id"`
	Title string `json:"title"`
}

func (repository *TypeRepositoryImpl) Update(ctx context.Context, arg UpdateTypeParams) (model.Type, error) {
	var campaignType model.Type

	sqlStatement := "UPDATE types SET title = $1 WHERE id = $2 RETURNING id, title, created_at"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.Title, arg.ID)

	err := row.Scan(
		&campaignType.ID,
		&campaignType.Title,
		&campaignType.CreatedAt,
	)

	return campaignType, err
}

type DeleteTypeParams struct {
	ID int64 `json:"id"`
}

func (repository *TypeRepositoryImpl) Delete(ctx context.Context, arg DeleteTypeParams) error {
	sqlStatement := "DELETE FROM types WHERE id = $1"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.ID)
	return err
}
