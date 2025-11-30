## Prerequisites

- Node.js 20+, `pnpm`
- Docker + Docker Compose (for the Postgres service in `backend/docker-compose.yml`)
- Environment variables are loaded from `.env.example` (copy it to `.env` with your own secrets when needed)

## Local development

```bash
make init   # install deps, start Postgres, migrate, generate Prisma client
make start  # run the API (use `make dev` for watch mode)
make down   # stop Postgres container
```

The API is available at `http://localhost:5433`.

## API overview

| Method | Path          | Description                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/cases`      | List cases with specimens    |
| GET    | `/cases/:id`  | Retrieve a single case       |
| POST   | `/cases`      | Create a case (full payload) |
| DELETE | `/cases/:id`  | Delete a case                |
