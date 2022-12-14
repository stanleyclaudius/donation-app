package repository

import (
	"context"
	"donation_app/pkg/model"
)

type CampaignRepository interface {
	Save(ctx context.Context, arg SaveCampaignParams) (model.Campaign, error)
	GetOneByID(ctx context.Context, arg CampaignIDParams) (model.Campaign, error)
	GetOneBySlug(ctx context.Context, arg CampaignSlugParams) (JoinedCampaignData, error)
	GetOneByFundraiserID(ctx context.Context, arg GetOneCampaignByFundraiserParams) (model.Campaign, error)
	GetMany(ctx context.Context, arg GetManyCampaignParams) ([]model.Campaign, int64, error)
	GetManyByFundraiser(ctx context.Context, arg GetManyCampaignByFundraiserParams) ([]JoinedCampaignData, int64, error)
	Delete(ctx context.Context, arg DeleteCampaignParams) error
	Update(ctx context.Context, arg UpdateCampaignParams) (model.Campaign, error)
	UpdateCollectedAmount(ctx context.Context, arg UpdateAmountParams) error
	UpdateWithdrawnAmount(ctx context.Context, arg UpdateAmountParams) error
}
