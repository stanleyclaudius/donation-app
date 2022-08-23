package model

import "time"

type Fundraiser struct {
	ID          int64
	UserID      int64
	Phone       string
	Address     string
	Description string
	IsActive    bool
	CreatedAt   time.Time
}
