package repository

import (
	"context"
	"donation_app/pkg/model"
)

type TypeRepository interface {
	Save(ctx context.Context, arg SaveTypeParams) (model.Type, error)
	GetOneByID(ctx context.Context, arg TypeIDParams) (model.Type, error)
	GetMany(ctx context.Context, arg GetManyTypeParams) ([]model.Type, error)
	Update(ctx context.Context, arg UpdateTypeParams) (model.Type, error)
	Delete(ctx context.Context, arg TypeIDParams) error
}
