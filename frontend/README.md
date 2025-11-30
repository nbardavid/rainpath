## Prerequisites

- Node.js 20+, `pnpm`
- Backend API running at `http://localhost:5433` (or set `VITE_API_URL`)

## Local development

```bash
pnpm install
make dev
```

Open `http://localhost:3000` (or the port shown by Vite). Keyboard shortcuts:

## make targets

```bash
make dev    # start Vite in dev/watch mode on port 3000
make build
make start  # rebuild and launch pnpm serve
```
