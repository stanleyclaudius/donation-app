package model

import "time"

type User struct {
	ID        int64     `json:"id"`
	Avatar    string    `json:"avatar"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	Role      string    `json:"role"`
}
