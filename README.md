# Link2Itinerary

**About this file:** This is the main project README that provides an overview of the entire Link2Itinerary project. Start here to understand what the project does, who's working on it, and how the repository is organized. You'll find information about the tech stack, team structure, and links to detailed documentation for each part of the project (frontend, backend, database, and docs).

**One-line pitch:** Paste a travel link, get an AI-powered personalized itinerary with real-time cost estimates and smart suggestions.

## Problem & Solution

**Problem:** Planning a trip is overwhelming—travelers face scattered information, hidden costs, and time-consuming research across multiple websites.

**Solution:** Link2Itinerary transforms any travel destination link (Airbnb, hotel, attraction) into a comprehensive, personalized itinerary using hosted LLMs and an intelligent agentic workflow.

**Wow moment:** Paste an Airbnb link → instantly see a teaser plan → add your preferences → get a full itinerary with cost breakdowns and booking links.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** NestJS, TypeScript
- **AI/LLM:** OpenAI (GPT-4/GPT-4o) (edit for LLM from link to video)
- **Database:** PostgreSQL
- **Deployment:** TBD (AWS/Vercel/Local)

## Team (suggested?)

| Name | Role | Primary Responsibilities |
|------|------|-------------------------|
| [Member 1] | Project Lead / Backend Lead | Architecture, LLM integration, trip planning engine |
| [Member 2] | Frontend Lead | React UI, user experience, frontend state management |
| [Member 3] | Backend Developer | API development, data models |
| [Member 4] | Full-stack Developer | Cost estimator, integration testing |
| [Member 5] | QA / DevOps | Test planning, CI/CD, deployment, documentation |

### Who Owns What

- **Trip Planning Engine:** Member 1, Member 3
- **LLM Integration & Prompts:** Member 1
- **Frontend UI/UX:** Member 2, Member 4
- **Cost Estimation:** Member 4
- **Database Schema:** Member 3
- **Testing & QA:** Member 5 (with support from all)
- **Documentation:** ALL

## Repository Map

```
/
├── frontend/          # React application (5 pages: Landing, Trip Seed, Teaser, Preferences, Itinerary)
├── backend/           # NestJS API server (3 modules: Trips, Planner, Estimator)
├── docs/              # Course deliverables and documentation
├── db/                # Database schemas and ER diagrams
├── README.md          # This file
├── .gitignore         # Git ignore rules
└── LICENSE            # Project license
```

### `/frontend/`
Contains the React-based user interface with five planned pages: Landing Page, Trip Seed Wizard, Teaser View, Preferences Wizard, and Itinerary View. The frontend communicates with the backend API to create trip seeds, generate itineraries, and display cost estimates.

See [frontend/README.md](./frontend/README.md) for details.

### `/backend/`
Contains the NestJS API server organized into three modules: **Trips** (trip seed CRUD), **Planner** (itinerary generation with OpenAI), and **Estimator** (cost calculations). The API provides endpoints for creating trips, generating teaser and full itineraries, and calculating cost breakdowns.

See [backend/README.md](./backend/README.md) for details.

### `/docs/`
All course deliverables including Software Requirements Specification (SRS), test plans, status reports, architecture documentation, and meeting notes.

See [docs/README.md](./docs/README.md) for an index.

### `/db/`
Database design artifacts including entity-relationship diagrams and schema documentation.

See [db/schema-plan.md](./db/schema-plan.md) for details.

## How to Get Started

### Prerequisites

- **Node.js** v18+ (recommended)
- **npm** (comes with Node.js)
- **Git**
- **Supabase account** (for database access - ask project lead for invite)

### Quick Start - Run Full Application

**1. Install Dependencies**

```bash
# Backend
cd backend
npm install
npm install openai cheerio @types/cheerio

# Frontend (new terminal)
cd frontend
npm install
```

**2. Configure Environment**

```bash
# Backend - create .env file
cd backend
cp .env.example .env
# Edit .env and add:
# - DATABASE_URL (Supabase connection string)
# - OPENAI_API_KEY (optional, needed for Planner module)

# Frontend - create .env file (optional, defaults work)
cd frontend
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:3000/api
# VITE_USE_MOCKS=false
```

**3. Start Backend (Terminal 1)**

```bash
cd backend
npm run start:dev
```

**Expected output:**
```
[Nest] LOG [NestApplication] Nest application successfully started
```

Backend runs on: **http://localhost:3000**

**4. Start Frontend (Terminal 2)**

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Frontend runs on: **http://localhost:5173**

**5. Open Application**

Open browser to: **http://localhost:5173**

You should see the Landing Page. Navigate through the app to test the full flow.

**Note:** If backend shows compilation errors about missing `openai` or `cheerio`, run `npm install openai cheerio @types/cheerio` in the backend directory.

### Detailed Setup Instructions

For complete setup instructions including troubleshooting, see:
- **[Running Full Application Guide](./docs/DocumentationsMD/Running-Full-Application.md)** - Complete guide to running both servers
- [backend/GETTING-STARTED.md](./backend/GETTING-STARTED.md) - Backend-specific setup
- [frontend/README.md](./frontend/README.md) - Frontend-specific setup

### Explore the Project

- Review `/docs/` for project requirements and architecture
- Check `/frontend/README.md` for the 5 planned pages and component structure
- Check `/backend/README.md` for the 3 modules and API endpoints
- Review `/backend/api-contracts.md` for complete API specifications
- Review `/db/schema-plan.md` for database schema (MVP tables only)

## Project Status

This repository currently contains the project skeleton and planning documents. Implementation will begin after requirements finalization and design approval.

**Current Phase:** Planning & Requirements Gathering

**MVP Features:**
- ✅ Trip seed creation from travel links
- ✅ Teaser itinerary generation (3-day overview)
- ✅ Full itinerary generation with preferences
- ✅ Cost estimation with category breakdowns
- ❌ Export, sharing, regeneration (excluded from MVP)
- ❌ User authentication (excluded from MVP)

## Course Information

**Course:** CEN4090L - Software Engineering II
**Academic Year:** 2026
**Institution:** FSU

## Links & Resources

- [Project Wiki/Documentation](./docs/)
- [Issue Tracker](#) (TBD)
- [Project Board](#) (TBD)

---

*For academic use in CEN4090L Software Engineering course.*
