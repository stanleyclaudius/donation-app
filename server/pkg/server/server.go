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
	accountService := service.NewUserService(server.DB, server.Config, server.PasetoToken)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-type"},
		AllowCredentials: true,
	}))

	routerGroup := router.Group("/api/v1")
	middlewareGroup := routerGroup.Group("/").Use(util.AuthMiddleware(server.PasetoToken))

	routerGroup.POST("/auth/register", accountService.Register)
	routerGroup.POST("/auth/login", accountService.Login)
	middlewareGroup.GET("/auth/logout", accountService.Logout)

	router.Run(server.Config.ServerAddress)
}
