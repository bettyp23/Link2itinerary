# Getting Started — Backend

A step-by-step guide to set up and run the Link2Itinerary backend locally.

## Prerequisites

- **Node.js** v18 or higher — [download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (to clone the repo)
- Access to the team's **Supabase project** (ask the project lead for an invite)

Check your versions:
```bash
node -v   # should be v18+
npm -v    # should be v9+
```

## Setup (one-time)

### 1. Install dependencies

```bash
cd backend
npm install
```

This reads `package.json` and installs everything you need. No need to install individual packages.

### 2. Create your environment file

```bash
cp .env.example .env
```

This creates a local `.env` file from the template. The `.env` file is gitignored so your secrets stay on your machine.

### 3. Add the Supabase connection string

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open the Link2Itinerary project
2. Click the **"Connect"** button in the **top right corner**
3. Copy the **Session Pooler** or **Transaction Pooler** URI
4. Open `backend/.env` and paste it as the `DATABASE_URL` value

It should look something like:
```
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxx:YourPassword@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

## Running the server

```bash
npm run start:dev
```

This starts the server at **http://localhost:3000** with hot reload — any code changes automatically restart the server.

You should see output ending with:
```
[Nest] LOG [NestApplication] Nest application successfully started
```

## Testing the API

With the server running, open a new terminal and try these curl commands:

### Create a trip seed

```bash
curl -X POST http://localhost:3000/api/trips/seed \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://airbnb.com/rooms/12345",
    "summary": "Weekend getaway to Paris",
    "location": "Paris, France",
    "checkIn": "2026-05-01",
    "checkOut": "2026-05-05",
    "accommodationName": "Charming apartment in Le Marais",
    "accommodationType": "airbnb"
  }'
```

You should get back a JSON response with a generated `id` (UUID).

### List all trip seeds

```bash
curl http://localhost:3000/api/trips
```

### Get one trip seed

```bash
curl http://localhost:3000/api/trips/PASTE-UUID-HERE
```

### Update a trip seed

```bash
curl -X PATCH http://localhost:3000/api/trips/PASTE-UUID-HERE \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Updated: Luxury Paris trip",
    "accommodationType": "hotel"
  }'
```

### Delete a trip seed

```bash
curl -X DELETE http://localhost:3000/api/trips/PASTE-UUID-HERE
```

Returns 204 (no content) on success.

### Test validation (should fail)

```bash
curl -X POST http://localhost:3000/api/trips/seed \
  -H "Content-Type: application/json" \
  -d '{
    "url": "not-a-valid-url",
    "location": "Paris",
    "checkIn": "bad-date"
  }'
```

Should return a 400 error with validation messages explaining what's wrong.

## Other useful commands

| Command | What it does |
|---------|-------------|
| `npm run start:dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start:prod` | Run the compiled production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Check code style with ESLint |
| `npm run format` | Auto-format code with Prettier |

## Project structure

```
backend/src/
├── trips/                          # Trip seeds module
│   ├── dto/
│   │   ├── create-trip-seed.dto.ts #   Validates POST request bodies
│   │   └── update-trip-seed.dto.ts #   Validates PATCH request bodies
│   ├── entities/
│   │   └── trip-seed.entity.ts     #   Database table definition
│   ├── trips.controller.ts         #   HTTP endpoints (routes)
│   ├── trips.service.ts            #   Business logic (CRUD operations)
│   └── trips.module.ts             #   Wires controller + service + entity
├── app.module.ts                   #   Root module (database connection, imports)
├── app.controller.ts               #   Default health check endpoint
├── app.service.ts                  #   Default service
└── main.ts                         #   App entry point (starts the server)
```

## API endpoints summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/trips/seed` | Create a new trip seed |
| GET | `/api/trips` | List all trip seeds |
| GET | `/api/trips/:id` | Get a specific trip seed |
| PATCH | `/api/trips/:id` | Update a trip seed |
| DELETE | `/api/trips/:id` | Delete a trip seed |

Full request/response specs are in [api-contracts.md](./api-contracts.md).

## Troubleshooting

**`ENOTFOUND db.xxx.supabase.co`**
Your connection string uses the old format. Use the pooler URI from the Supabase "Connect" button instead. The hostname should be `aws-0-REGION.pooler.supabase.com`, not `db.xxx.supabase.co`.

**`nest: command not found`**
The NestJS CLI isn't installed globally. Either install it (`npm install -g @nestjs/cli`) or use npx (`npx @nestjs/cli`). For running the server, `npm run start:dev` works without the global CLI.

**`Unable to connect to the database. Retrying...`**
Check that your `DATABASE_URL` in `.env` is correct. Make sure there are no extra spaces or quotes around the value.

**Port 3000 already in use**
Another process is using port 3000. Either stop it or change the `PORT` value in `.env` to something else (e.g., `3001`).

**Empty response from `GET /api/trips`**
This is normal if no trips have been created yet. The endpoint returns `[]` (empty array). Create one with the POST curl command above.
