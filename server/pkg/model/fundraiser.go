package model

import "time"

type Fundraiser struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	Phone       string    `json:"phone"`
	Address     string    `json:"address"`
	Description string    `json:"description"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}
