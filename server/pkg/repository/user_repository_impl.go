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

type GetOneUserByEmailParams struct {
	Email string `json:"email"`
}

func (repository *UserRepositoryImpl) GetOneByEmail(ctx context.Context, arg GetOneUserByEmailParams) (model.User, error) {
	var user model.User

	sqlStatement := "SELECT * FROM users WHERE email = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.Email)

	err := row.Scan(
		&user.ID,
		&user.Avatar,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.Role,
	)

	return user, err
}

type GetOneUserByIDParams struct {
	ID int64 `json:"id"`
}

func (repository *UserRepositoryImpl) GetOneById(ctx context.Context, arg GetOneUserByIDParams) (model.User, error) {
	var user model.User

	sqlStatement := "SELECT * FROM users WHERE id = $1"
	row := repository.DB.QueryRowContext(ctx, sqlStatement, arg.ID)

	err := row.Scan(
		&user.ID,
		&user.Avatar,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.Role,
	)

	return user, err
}

type UpdateUserRoleParams struct {
	ID   int64  `json:"id"`
	Role string `json:"role"`
}

func (repository *UserRepositoryImpl) UpdateRole(ctx context.Context, arg UpdateUserRoleParams) error {
	sqlStatement := "UPDATE users SET role = $1 WHERE id = $2"
	_, err := repository.DB.ExecContext(ctx, sqlStatement, arg.Role, arg.ID)
	return err
}
