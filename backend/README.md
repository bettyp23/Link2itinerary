# Backend - Link2Itinerary API

**About this file:** This README explains the backend API server for Link2Itinerary. It describes how the server is organized into modules (Trips, Planner, and Estimator), what API endpoints are available, how the system integrates with OpenAI to generate itineraries, and how to set up and run the backend. If you're working on the API, database, or LLM integration, this is your starting point.

NestJS-based REST API server for Link2Itinerary, handling LLM integration, trip planning, cost estimation, and data persistence.

## Planned Architecture

### Modules

The backend will be organized into the following NestJS modules:

| Module | Purpose | Key Responsibilities |
|--------|---------|---------------------|
| **Trips** | Trip seed management | Create/update/delete trip seeds, store user-provided links and summaries |
| **Planner** | Itinerary generation | Orchestrate LLM calls, manage agentic workflow, generate teaser and full itineraries |
| **Estimator** | Cost calculations | Calculate budget estimates, provide cost breakdowns |

### Planned Endpoints

#### Trip Seeds

| Route | Method | Purpose | Request Body | Response |
|-------|--------|---------|--------------|----------|
| `/api/trips/seed` | POST | Create trip seed from link | `{ url, summary?, preferences? }` | Trip seed object with initial metadata |
| `/api/trips/:id` | GET | Get trip details | - | Trip seed + current itinerary status |
| `/api/trips/:id` | PATCH | Update trip preferences | `{ preferences }` | Updated trip object |
| `/api/trips/:id` | DELETE | Delete trip | - | Success confirmation |

#### Planning & Itinerary

| Route | Method | Purpose | Request Body | Response |
|-------|--------|---------|--------------|----------|
| `/api/planner/teaser` | POST | Generate teaser plan | `{ tripId }` | Quick 3-day teaser itinerary |
| `/api/planner/full` | POST | Generate full itinerary | `{ tripId, preferences }` | Complete personalized itinerary |

#### Cost Estimation

| Route | Method | Purpose | Request Body | Response |
|-------|--------|---------|--------------|----------|
| `/api/estimator/calculate` | POST | Get cost estimates | `{ itineraryId }` | Detailed cost breakdown |

### LLM Integration Design

#### LLM Provider Support

- **Primary:** OpenAI GPT-4 / GPT-4o

#### Agentic Workflow

The planner will use a multi-step agentic approach:

1. **Web Scraper Agent** - Extract metadata from user-provided link
2. **Context Builder Agent** - Enrich location data (attractions, restaurants, weather)
3. **Planner Agent** - Generate day-by-day itinerary using structured JSON schema
4. **Consistency Engine** - Validate logical flow (deterministic, rule-based)
5. **Cost Estimator Agent** - Calculate budget breakdown

#### LLM Request/Response Schema

**Standard Planner Request:**
```json
{
  "location": "Paris, France",
  "checkIn": "2026-05-01",
  "checkOut": "2026-05-05",
  "accommodation": {
    "name": "Airbnb in Le Marais",
    "address": "123 Rue de Rivoli"
  },
  "preferences": {
    "interests": ["museums", "food", "architecture"],
    "budget": "moderate",
    "pace": "relaxed",
    "dietary": []
  }
}
```

**Standard Planner Response:**
```json
{
  "itinerary": {
    "id": "uuid",
    "tripId": "trip-uuid",
    "days": [
      {
        "date": "2026-05-01",
        "activities": [
          {
            "time": "09:00",
            "duration": 120,
            "title": "Visit Louvre Museum",
            "description": "...",
            "location": "...",
            "estimatedCost": 25,
            "bookingUrl": "..."
          }
        ]
      }
    ],
    "totalEstimatedCost": {
      "min": 450,
      "max": 650,
      "currency": "USD"
    }
  }
}
```

See [api-contracts.md](./api-contracts.md) for full request/response specifications.

## Technology Stack

- **Framework:** NestJS (TypeScript)
- **Database ORM:** TypeORM or Prisma (TBD)
- **LLM Client:** OpenAI SDK
- **Validation:** class-validator, class-transformer
- **Testing:** Jest, Supertest
- **Documentation:** Swagger/OpenAPI

## Development Setup (To Be Implemented)

```bash
# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev

# Run tests
npm run test
```

## Environment Variables (Planned)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/link2itinerary
OPENAI_API_KEY=sk-...
PORT=3000
```

## Directory Structure (Planned)

```
backend/
├── src/
│   ├── trips/              # Trip seeds module
│   ├── planner/            # Itinerary planner module
│   ├── estimator/          # Cost estimator module
│   ├── common/             # Shared utilities
│   ├── database/           # Database config
│   └── main.ts             # App entry point
├── test/                   # E2E tests
├── package.json
└── tsconfig.json
```

## Next Steps

1. Initialize NestJS project: `nest new backend`
2. Set up database connection and migrations
3. Implement trip seeds CRUD
4. Integrate OpenAI API for basic planning
5. Build consistency validation engine
6. Add cost estimation logic
