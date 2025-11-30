## Prerequisites

- Node.js 20+, `pnpm`
- Docker + Docker Compose (for the Postgres service in `backend/docker-compose.yml`)
- Environment variables are loaded from `.env.example` (copy it to `.env` with your own secrets when needed)

## Local development

```bash
pnpm install
pnpm run dev
```

The `dev` script boots the Docker services defined in `docker-compose.yml`, runs pending Prisma migrations, generates the client, and then starts the Nest server. The API is available at `http://localhost:5433`. Use `pnpm run start` to launch the API without the extra setup steps or `pnpm run start:dev` for watch mode.

## API overview

| Method | Path          | Description                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/cases`      | List cases with specimens    |
| GET    | `/cases/:id`  | Retrieve a single case       |
| POST   | `/cases`      | Create a case (full payload) |
| DELETE | `/cases/:id`  | Delete a case                |
