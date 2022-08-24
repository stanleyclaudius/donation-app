package repository

import (
	"context"
	"donation_app/pkg/model"
)

type UserRepository interface {
	Save(ctx context.Context, arg SaveUserParams) (model.User, error)
	GetById(ctx context.Context, arg GetUserByIDParams) (model.User, error)
	GetByEmail(ctx context.Context, arg GetUserByEmailParams) (model.User, error)
	UpdateRole(ctx context.Context, arg UpdateUserRoleParams) error
}
