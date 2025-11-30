## Prerequisites

- Node.js 20+, `pnpm`
- Docker + Docker Compose (for the Postgres service in `backend/docker-compose.yml`)
- A `.env` file with `DATABASE_URL=postgresql://...` (see `prisma/.env.example` if needed)

## Local development

```bash
pnpm install
docker compose up --build
pnpm prisma migrate dev   # first launch: apply migrations
pnpm start
```

The API is available at `http://localhost:5433`.

## API overview

| Method | Path          | Description                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/cases`      | List cases with specimens    |
| GET    | `/cases/:id`  | Retrieve a single case       |
| POST   | `/cases`      | Create a case (full payload) |
| DELETE | `/cases/:id`  | Delete a case                |
