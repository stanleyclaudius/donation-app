package model

import "time"

type Campaign struct {
	ID              int64
	FundraiserID    int64
	TypeID          int64
	Title           string
	Description     string
	Image           string
	CollectedAmount float64
	TargetAmount    float64
	WithdrawnAmount float64
	Slug            string
	CreatedAt       time.Time
}
