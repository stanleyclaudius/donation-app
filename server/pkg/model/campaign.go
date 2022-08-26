package model

import "time"

type Campaign struct {
	ID              int64     `json:"id"`
	FundraiserID    int64     `json:"fundraiser_id"`
	TypeID          int64     `json:"type_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Image           string    `json:"image"`
	CollectedAmount float64   `json:"collected_amount"`
	TargetAmount    float64   `json:"target_amount"`
	WithdrawnAmount float64   `json:"withdrawn_amount"`
	Slug            string    `json:"slug"`
	CreatedAt       time.Time `json:"created_at"`
}
