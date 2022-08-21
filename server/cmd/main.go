package cmd

import (
	"database/sql"
	"donation_app/pkg/server"
	"donation_app/pkg/util"
	"log"

	_ "github.com/lib/pq"
)

func Start() {
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load ENV file.")
	}

	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatal("Failed to connect to database.")
	}

	server := server.NewServer(config, conn)
	server.InitRouter()
}
