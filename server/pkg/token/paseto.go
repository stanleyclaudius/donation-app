package token

import (
	"fmt"
	"time"

	"github.com/aead/chacha20poly1305"
	"github.com/o1egl/paseto"
)

type PasetoToken struct {
	Paseto       *paseto.V2
	SymmetricKey []byte
}

func NewPasetoToken(symmetricKey string) (*PasetoToken, error) {
	if len(symmetricKey) != chacha20poly1305.KeySize {
		return nil, fmt.Errorf("invalid key size, should be exactly %d characters", chacha20poly1305.KeySize)
	}

	pasetoToken := &PasetoToken{
		Paseto:       paseto.NewV2(),
		SymmetricKey: []byte(symmetricKey),
	}

	return pasetoToken, nil
}

func (pasetoToken *PasetoToken) CreateToken(userID int64, duration time.Duration) (string, error) {
	payload := NewPayload(userID, duration)

	token, err := pasetoToken.Paseto.Encrypt(pasetoToken.SymmetricKey, payload, nil)
	return token, err
}

func (pasetoToken *PasetoToken) VerifyToken(token string) (*Payload, error) {
	payload := &Payload{}

	err := pasetoToken.Paseto.Decrypt(token, pasetoToken.SymmetricKey, payload, nil)
	if err != nil {
		return nil, ErrInvalidToken
	}

	err = payload.Valid()
	if err != nil {
		return nil, err
	}

	return payload, nil
}
