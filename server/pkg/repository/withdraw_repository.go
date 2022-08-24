package repository

import (
	"context"
	"donation_app/pkg/model"
)

type WithdrawRepository interface {
	Save(ctx context.Context, arg SaveWithdrawParams) (model.Withdraw, error)
	GetManyByCampaign(ctx context.Context, arg GetManyWithdrawByCampaignParams) ([]model.Withdraw, error)
}
