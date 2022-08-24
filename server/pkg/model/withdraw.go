package model

import "time"

type Withdraw struct {
	ID         int64
	CampaignID int64
	Amount     float64
	CreatedAt  time.Time
}
