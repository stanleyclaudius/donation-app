package repository

import (
	"context"
	"donation_app/pkg/model"
)

type DonationRepository interface {
	Save(ctx context.Context, arg SaveDonationParams) (model.Donation, error)
	GetManyByUser(ctx context.Context, arg GetManyDonationByUserParams) ([]model.Donation, error)
	GetManyByCampaign(ctx context.Context, arg GetManyDonationByCampaignParams) ([]model.Donation, error)
}
