package model

import "time"

type Withdraw struct {
	ID         int64     `json:"id"`
	CampaignID int64     `json:"campaign_id"`
	Amount     float64   `json:"amount"`
	CreatedAt  time.Time `json:"created_at"`
}
