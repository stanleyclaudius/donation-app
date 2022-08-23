package model

import "time"

type Type struct {
	ID        int64
	Title     string
	CreatedAt time.Time
}
