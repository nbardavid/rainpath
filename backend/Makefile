.PHONY: init start install compose-up compose-down down stop migrate generate dev build lint test

init: install compose-up migrate generate

start:
	pnpm start

install:
	pnpm install

compose-up:
	docker compose up --build -d

compose-down:
	docker compose down

down: compose-down

stop: down

migrate:
	pnpm prisma migrate dev

generate:
	pnpm prisma generate

dev:
	pnpm start:dev

build:
	pnpm build

lint:
	pnpm lint

test:
	pnpm test
