package repository

import (
	"context"
	"donation_app/pkg/model"
)

type CampaignRepository interface {
	Save(ctx context.Context, arg SaveCampaignParams) (model.Campaign, error)
	GetOneByID(ctx context.Context, arg CampaignIDParams) (model.Campaign, error)
	GetOneByFundraiserID(ctx context.Context, arg GetOneCampaignByFundraiserParams) (model.Campaign, error)
	GetMany(ctx context.Context, arg GetManyCampaignParams) ([]model.Campaign, error)
	GetManyByFundraiser(ctx context.Context, arg GetManyCampaignByFundraiserParams) ([]model.Campaign, error)
	Delete(ctx context.Context, arg DeleteCampaignParams) error
	Update(ctx context.Context, arg UpdateCampaignParams) (model.Campaign, error)
}
