package repository

import (
	"context"
	"donation_app/pkg/model"
)

type CampaignRepository interface {
	Save(ctx context.Context, arg SaveCampaignParams) (model.Campaign, error)
}
