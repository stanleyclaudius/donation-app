package repository

import (
	"context"
	"donation_app/pkg/model"
)

type DonationRepository interface {
	Save(ctx context.Context, arg SaveDonationParams) (model.Donation, error)
	GetManyByUser(ctx context.Context, arg GetManyDonationByUserParams) ([]JoinedHistoryData, int64, error)
	GetManyByCampaign(ctx context.Context, arg GetManyDonationByCampaignParams) ([]JoinedDonationData, error)
}
