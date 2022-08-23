package repository

import (
	"context"
	"donation_app/pkg/model"
)

type TypeRepository interface {
	Save(ctx context.Context, arg SaveTypeParams) (model.Type, error)
}
