postgres:
	docker run --name donation-app-db -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:14

createdb:
	docker exec -it donation-app-db createdb --username=root --owner root donation_app

dropdb:
	docker exec -it donation-app-db dropdb --username=root donation_app

migrateup:
	migrate -path pkg/migration -database "postgresql://root:secret@localhost:5433/donation_app?sslmode=disable" -verbose up

migratedown:
	migrate -path pkg/migration -database "postgresql://root:secret@localhost:5433/donation_app?sslmode=disable" -verbose down

test:
	go test -v -cover ./...

server:
	go run main.go

.PHONY: postgres createdb dropdb migrateup migratedown test server