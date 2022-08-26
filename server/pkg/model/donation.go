package model

import "time"

type Donation struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	CampaignID  int64     `json:"campaign_id"`
	Amount      float64   `json:"amount"`
	Words       string    `json:"words"`
	IsAnonymous bool      `json:"is_anonymous"`
	CreatedAt   time.Time `json:"created_at"`
}
