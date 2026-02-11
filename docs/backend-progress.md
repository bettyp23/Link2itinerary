# Backend Development Progress Log

**Project:** Link2Itinerary Backend API
**Framework:** NestJS (TypeScript)
**Database:** PostgreSQL via Supabase
**Started:** 2026-02-11

---

## Session 1 — Project Scaffolding & Setup (2026-02-11)

### What was done

1. **Added `CLAUDE.md`** to the project root
   - Configures Claude Code as a NestJS backend architect/educator
   - Contains architectural patterns, code examples, and module boundaries
   - Acts as a reference for the team on NestJS best practices

2. **Scaffolded the NestJS project** in `backend/`
   - Ran `nest new . --package-manager npm` inside `backend/`
   - Had to temporarily rename existing `README.md` to avoid a merge conflict with the CLI scaffold, then restored it
   - This created the standard NestJS project structure: `src/`, `test/`, `tsconfig.json`, `package.json`, etc.

3. **Installed core dependencies**
   ```bash
   npm install @nestjs/typeorm typeorm pg class-validator class-transformer
   ```
   - `@nestjs/typeorm` + `typeorm` — ORM for database access
   - `pg` — PostgreSQL driver (works with Supabase since Supabase is Postgres)
   - `class-validator` + `class-transformer` — DTO validation for API request bodies

4. **Decided on Supabase** as the hosted database
   - Supabase is PostgreSQL under the hood, so the existing schema plan (`db/schema-plan.md`) and TypeORM entities require no changes
   - Connection is just a `DATABASE_URL` in `.env` pointing at the Supabase project
   - Future benefits: built-in Auth, Row Level Security, real-time subscriptions

### Current project structure (backend/)
```
backend/
├── src/
│   ├── app.controller.ts       # Default controller (will be replaced)
│   ├── app.controller.spec.ts  # Default test
│   ├── app.module.ts           # Root module (will add TypeORM config here)
│   ├── app.service.ts          # Default service
│   └── main.ts                 # App entry point
├── test/
│   ├── app.e2e-spec.ts         # E2E test template
│   └── jest-e2e.json           # E2E test config
├── .gitignore                  # Ignores node_modules, .env, dist, etc.
├── package.json                # All dependencies listed here
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript config
├── tsconfig.build.json         # Build-specific TS config
├── README.md                   # Backend planning doc (restored)
└── api-contracts.md            # API request/response specs
```

### For teammates: getting started

```bash
cd backend
npm install        # Installs all dependencies from package.json
npm run start:dev  # Starts the dev server with hot reload
```

No need to install individual packages — `npm install` reads `package.json` and handles everything.

### Key files to know about
- **`package.json`** — Lists all dependencies. When anyone adds a new package with `npm install <package>`, it's automatically added here
- **`package-lock.json`** — Locks exact versions so everyone gets identical installs. Always commit this file
- **`.gitignore`** — Already configured to exclude `node_modules/`, `.env` files, `dist/`, etc.
- **`.env`** — Will contain `DATABASE_URL` and `OPENAI_API_KEY`. Each teammate creates their own (it's gitignored for security)

---

## Session 2 — Supabase Connection & Trips Module (2026-02-11)

### What was done

1. **Installed `@nestjs/config`** for environment variable support
   ```bash
   npm install @nestjs/config
   ```
   - Loads `.env` files automatically so `process.env.DATABASE_URL` works everywhere

2. **Created `.env.example`** (`backend/.env.example`)
   - Template with placeholder values for `DATABASE_URL`, `OPENAI_API_KEY`, and `PORT`
   - Teammates copy this to `.env` and fill in their own values
   - `.env` is gitignored — secrets never go into version control

3. **Configured Supabase database connection** (`src/app.module.ts`)
   - Added `ConfigModule.forRoot()` to load `.env` files globally
   - Added `TypeOrmModule.forRoot()` with Supabase PostgreSQL connection via `DATABASE_URL`
   - `autoLoadEntities: true` — entities registered in modules are picked up automatically
   - `synchronize: true` — auto-creates/updates tables from entities (dev only, disable in prod!)

4. **Built the complete Trips module** — the foundation for everything else
   - **Entity** (`src/trips/entities/trip-seed.entity.ts`): `TripSeed` entity mapping to the `trip_seeds` table with all columns from the schema plan (url, summary, location, checkIn, checkOut, accommodationName, accommodationType, metadata, status)
   - **DTOs** (`src/trips/dto/`):
     - `CreateTripSeedDto` — validates POST requests (url required, dates in ISO format, etc.)
     - `UpdateTripSeedDto` — validates PATCH requests (all fields optional for partial updates)
   - **Service** (`src/trips/trips.service.ts`): Full CRUD operations with proper error handling (throws 404 when trip not found)
   - **Controller** (`src/trips/trips.controller.ts`): REST endpoints mapped to service methods:
     - `POST /api/trips/seed` — create a trip seed
     - `GET /api/trips` — list all trip seeds
     - `GET /api/trips/:id` — get one trip seed (UUID validated)
     - `PATCH /api/trips/:id` — update a trip seed
     - `DELETE /api/trips/:id` — delete a trip seed (returns 204)
   - **Module** (`src/trips/trips.module.ts`): Wires everything together, exports `TripsService` so Planner and Estimator modules can use it later

5. **Enabled global validation pipe** (`src/main.ts`)
   - `whitelist: true` — strips unknown properties from requests (security: prevents extra fields)
   - `transform: true` — auto-converts types (e.g., string params to proper types)

### Updated project structure (backend/)
```
backend/
├── src/
│   ├── trips/                          # NEW — Trip seeds module
│   │   ├── dto/
│   │   │   ├── create-trip-seed.dto.ts #   Create validation rules
│   │   │   └── update-trip-seed.dto.ts #   Update validation rules
│   │   ├── entities/
│   │   │   └── trip-seed.entity.ts     #   Database entity
│   │   ├── trips.controller.ts         #   REST endpoints
│   │   ├── trips.service.ts            #   Business logic
│   │   └── trips.module.ts             #   Module wiring
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts                   # UPDATED — TypeORM + Config + TripsModule
│   ├── app.service.ts
│   └── main.ts                         # UPDATED — validation pipe enabled
├── test/
├── .env.example                        # NEW — environment template
├── .gitignore
├── package.json                        # UPDATED — new dependencies added
├── package-lock.json
├── tsconfig.json
├── tsconfig.build.json
├── README.md
└── api-contracts.md
```

### How the request flow works

Here's what happens when someone calls `POST /api/trips/seed`:

```
Client sends POST /api/trips/seed with JSON body
  → ValidationPipe checks body against CreateTripSeedDto rules
    → If invalid: returns 400 Bad Request automatically
    → If valid: passes to TripsController.create()
      → Controller delegates to TripsService.create()
        → Service uses TypeORM Repository to save to Supabase Postgres
          → Returns saved entity with generated UUID
            → Controller sends it back as JSON response (201 Created)
```

### For teammates: getting started (updated)

```bash
cd backend
npm install                # Install all dependencies
cp .env.example .env       # Create your local .env file
# Edit .env with your Supabase DATABASE_URL
npm run start:dev          # Start dev server with hot reload (http://localhost:3000)
```

### Key architectural decisions explained

- **Why thin controllers?** Controllers only handle HTTP concerns. Business logic lives in services so it can be tested without HTTP and reused by other modules.
- **Why DTOs?** They validate incoming data automatically. Invalid requests get rejected before touching your business logic.
- **Why export TripsService?** The Planner module will need to look up trip data when generating itineraries. Exporting the service makes it injectable across modules.
- **Why `synchronize: true`?** During development, TypeORM auto-creates tables from entities. In production, we'll use migrations instead for safety.

---

## Session 3 — Supabase Connection & Endpoint Testing (2026-02-11)

### What was done

1. **Connected to Supabase database**
   - Created a Supabase project (project ref: `xugyrhoeviohqibmhrkz`, region: `us-west-2`)
   - Copied the **pooler connection string** from the Supabase Dashboard (click "Connect" button in top right) into `backend/.env`
   - **Important:** The direct `db.xxx.supabase.co` hostname no longer works. Use the pooler format:
     ```
     postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
     ```
   - On first `npm run start:dev`, TypeORM automatically created the `trip_seeds` table in Supabase (via `synchronize: true`)

2. **Verified all Trips endpoints work end-to-end**

   All 5 CRUD endpoints tested with curl and confirmed working against the live Supabase database:

   **Create a trip seed** — `POST /api/trips/seed`
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
   Returns: 201 Created with the saved trip seed (including generated UUID)

   **List all trip seeds** — `GET /api/trips`
   ```bash
   curl http://localhost:3000/api/trips
   ```
   Returns: array of all trip seeds, most recent first

   **Get one trip seed** — `GET /api/trips/:id`
   ```bash
   curl http://localhost:3000/api/trips/YOUR-UUID-HERE
   ```
   Returns: single trip seed object (or 404 if not found)

   **Update a trip seed** — `PATCH /api/trips/:id`
   ```bash
   curl -X PATCH http://localhost:3000/api/trips/YOUR-UUID-HERE \
     -H "Content-Type: application/json" \
     -d '{
       "summary": "Updated: Luxury Paris trip",
       "accommodationType": "hotel"
     }'
   ```
   Returns: updated trip seed object

   **Delete a trip seed** — `DELETE /api/trips/:id`
   ```bash
   curl -X DELETE http://localhost:3000/api/trips/YOUR-UUID-HERE
   ```
   Returns: 204 No Content (empty response on success)

   **Validation test** (invalid data returns 400 Bad Request):
   ```bash
   curl -X POST http://localhost:3000/api/trips/seed \
     -H "Content-Type: application/json" \
     -d '{
       "url": "not-a-valid-url",
       "location": "Paris",
       "checkIn": "bad-date"
     }'
   ```
   Returns: 400 with validation error messages

3. **Database state after testing**
   - The `trip_seeds` table was auto-created in Supabase by TypeORM
   - You can view the data in the Supabase Dashboard under Table Editor
   - The existing `profiles` table (from Supabase starter template) was not affected

### Troubleshooting notes

- **`ENOTFOUND db.xxx.supabase.co`** — This means the connection string uses the old direct hostname format. Use the pooler connection string instead (see step 1 above)
- **`nest: command not found`** — Install the NestJS CLI globally (`npm install -g @nestjs/cli`) or use `npx @nestjs/cli` instead
- **Scaffold `README.md` conflict** — If `nest new .` fails because `README.md` already exists, temporarily rename it, scaffold, then restore it

### For teammates: complete setup guide

```bash
# 1. Clone the repo and navigate to backend
cd backend

# 2. Install all dependencies (reads package.json automatically)
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Edit .env with the Supabase connection string
#    Go to: Supabase Dashboard > your project > click "Connect" (top right)
#    Copy the Session Pooler or Transaction Pooler URI
#    Paste it as the DATABASE_URL value in .env

# 5. Start the dev server (hot reload enabled)
npm run start:dev

# 6. Test it works
curl http://localhost:3000/api/trips
# Should return [] (empty array) if no trips exist yet
```

---

## Next steps

- [x] Set up Supabase project and configure database connection in `app.module.ts`
- [x] Create `.env.example` with placeholder values for teammates
- [x] Build the **Trips module** (entity, DTO, service, controller)
- [x] Connect to Supabase and test all Trips endpoints end-to-end
- [ ] Build the **Planner module** (LLM orchestration, itinerary generation)
- [ ] Build the **Estimator module** (cost calculations)
- [ ] Add Swagger/OpenAPI documentation

---

*This file is updated as development progresses. Check git history for detailed changes.*
