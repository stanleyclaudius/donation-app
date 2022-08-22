package repository

import (
	"context"
	"database/sql"
	"donation_app/pkg/model"
)

type UserRepositoryImpl struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		DB: db,
	}
}

type SaveUserParams struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (repository *UserRepositoryImpl) Save(ctx context.Context, arg SaveUserParams) (model.User, error) {
	var user model.User

	sqlStatement := "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, avatar, name, email, created_at, role"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.Name, arg.Email, arg.Password)

	err := row.Scan(
		&user.ID,
		&user.Avatar,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.Role,
	)

	return user, err
}
