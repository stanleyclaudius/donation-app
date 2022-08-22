package repository

import (
	"context"
	"donation_app/pkg/model"
)

type UserRepository interface {
	Save(ctx context.Context, arg SaveUserParams) (model.User, error)
}
