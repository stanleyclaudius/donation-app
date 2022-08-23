package server

import (
	"database/sql"
	"donation_app/pkg/service"
	"donation_app/pkg/token"
	"donation_app/pkg/util"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	PasetoToken *token.PasetoToken
	Config      util.Config
	DB          *sql.DB
}

func NewServer(config util.Config, db *sql.DB) *Server {
	pasetoToken, err := token.NewPasetoToken(config.TokenSymmetricKey)
	if err != nil {
		log.Fatal("Failed to initialize paseto token.")
	}

	return &Server{
		Config:      config,
		DB:          db,
		PasetoToken: pasetoToken,
	}
}

func (server *Server) InitRouter() {
	userService := service.NewUserService(server.DB, server.Config, server.PasetoToken)
	typeService := service.NewTypeService(server.DB)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-type"},
		AllowCredentials: true,
	}))

	routerGroup := router.Group("/api/v1")
	middlewareGroup := routerGroup.Group("/").Use(util.AuthMiddleware(server.PasetoToken))

	routerGroup.POST("/auth/register", userService.Register)
	routerGroup.POST("/auth/login", userService.Login)
	routerGroup.GET("/auth/refresh_token", userService.RefreshToken)
	middlewareGroup.GET("/auth/logout", userService.Logout)

	routerGroup.POST("/type", typeService.CreateType)

	router.Run(server.Config.ServerAddress)
}
