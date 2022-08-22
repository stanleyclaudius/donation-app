package model

import "time"

type User struct {
	ID        int64
	Avatar    string
	Name      string
	Email     string
	Password  string
	CreatedAt time.Time
	Role      string
}
