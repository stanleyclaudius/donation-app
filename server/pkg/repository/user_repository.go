package repository

import (
	"context"
	"donation_app/pkg/model"
)

type UserRepository interface {
	Save(ctx context.Context, arg SaveUserParams) (model.User, error)
	GetOneById(ctx context.Context, arg GetOneUserByIDParams) (model.User, error)
	GetOneByEmail(ctx context.Context, arg GetOneUserByEmailParams) (model.User, error)
	UpdateRole(ctx context.Context, arg UpdateUserRoleParams) error
}
