package repository

import (
	"context"
	"donation_app/pkg/model"
)

type FundraiserRepository interface {
	Save(ctx context.Context, arg SaveFundraiserParams) (model.Fundraiser, error)
	GetOneByUserID(ctx context.Context, arg GetFundraiserByUserIDParams) (model.Fundraiser, error)
	GetOneByID(ctx context.Context, arg FundraiserIDParams) (model.Fundraiser, error)
	GetMany(ctx context.Context, arg GetManyFundraiserParams) ([]model.Fundraiser, error)
	UpdateStatus(ctx context.Context, arg UpdateFundraiserStatusParams) error
	Delete(ctx context.Context, arg FundraiserIDParams) error
}
