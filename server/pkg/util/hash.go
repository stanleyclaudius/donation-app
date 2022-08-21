package util

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashed_password, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password %w", err)
	}

	return string(hashed_password), nil
}

func VerifyPassword(password string, hashed_password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed_password), []byte(password))
}
