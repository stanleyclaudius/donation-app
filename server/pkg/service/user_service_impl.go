package service

import (
	"database/sql"
	"donation_app/pkg/repository"
	"donation_app/pkg/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type UserServiceImpl struct {
	UserRepository repository.UserRepository
	DB             *sql.DB
}

func NewUserService(db *sql.DB) UserService {
	userRepository := repository.NewUserRepository(db)

	return &UserServiceImpl{
		UserRepository: userRepository,
		DB:             db,
	}
}

func userResponse() {

}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

func (service *UserServiceImpl) Register(ctx *gin.Context) {
	var req RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Please provide required field to register."})
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	arg := repository.SaveUserParams{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
	}

	user, err := service.UserRepository.Save(ctx, arg)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email has been used before."})
				return
			}
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": user})
}
