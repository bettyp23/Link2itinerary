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

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Git**
- **PostgreSQL** (for local development, when implemented)
- **OpenAI API key** (to be configured later) (unsure)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Link2itinerary
   ```

2. **Explore the planning documents:**
   - Review `/docs/` for project requirements and architecture
   - Check `/frontend/README.md` for the 5 planned pages and component structure
   - Check `/backend/README.md` for the 3 modules and API endpoints
   - Review `/backend/api-contracts.md` for complete API specifications
   - Review `/db/schema-plan.md` for database schema (MVP tables only)

3. **Understand MVP scope:**
   - Core features: Trip seed creation, teaser itinerary, full itinerary generation, preferences, cost estimation
   - Excluded from MVP: Export, sharing, regeneration, versioning, user authentication
   - See [PROJECT-SETUP-SUMMARY.md](./PROJECT-SETUP-SUMMARY.md) for detailed scope management

4. **Implementation steps will be added as development progresses**

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
