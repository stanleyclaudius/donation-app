package model

import "time"

type Donation struct {
	ID          int64
	UserID      int64
	CampaignID  int64
	Amount      float64
	Words       string
	IsAnonymous bool
	CreatedAt   time.Time
}
