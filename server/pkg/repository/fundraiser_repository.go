package repository

import (
	"context"
	"donation_app/pkg/model"
)

type FundraiserRepository interface {
	Save(ctx context.Context, arg SaveFundraiserParams) (model.Fundraiser, error)
	GetOneByUserID(ctx context.Context, arg GetFundraiserByUserIDParams) (model.Fundraiser, error)
}
