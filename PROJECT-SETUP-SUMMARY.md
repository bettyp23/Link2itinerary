# Link2Itinerary - Project Setup Summary

**About this file:** This document provides a comprehensive overview of the project structure, key documents, and next steps for the Link2Itinerary MVP. It explains what files have been created, where to find important documentation, and outlines the development workflow. Use this as your roadmap for getting started with the project and understanding how all the pieces fit together.

**Created:** January 18, 2026
**Status:** Skeleton complete, ready for development

---

## What's Been Created

This repository now contains a complete project skeleton with planning documents for all course deliverables. **No implementation code has been written yet** - this is purely the planning and organizational structure.

**MVP Scope:** The planning documents focus on the core MVP features: trip seed creation from links, teaser itinerary generation, full itinerary generation with preferences, and basic cost estimation. Features like export, sharing, regeneration, versioning, and user authentication are explicitly excluded from MVP and marked as future enhancements.

### MVP Features Summary

**Backend (3 Modules):**
- **Trips Module:** Create, read, update, delete trip seeds from user-provided links
- **Planner Module:** Generate teaser (3-day) and full itineraries using OpenAI
- **Estimator Module:** Calculate cost estimates with category breakdowns

**Frontend (5 Pages):**
- **Landing Page:** Introduction and "Get Started" CTA
- **Trip Seed Wizard:** Collect travel link and optional summary
- **Teaser View:** Display 3-day overview with themes and highlights
- **Preferences Wizard:** Collect interests, budget, pace, dietary/accessibility needs
- **Itinerary View:** Display complete day-by-day itinerary with cost breakdown

**API Endpoints (9 total):**
- Trip Seeds: POST `/api/trips/seed`, GET `/api/trips/:id`, PATCH `/api/trips/:id`, DELETE `/api/trips/:id`
- Planner: POST `/api/planner/teaser`, POST `/api/planner/full`
- Estimator: POST `/api/estimator/calculate`

**Database Tables (7 MVP tables):**
- `trip_seeds`, `preferences`, `itineraries`, `itinerary_days`, `activities`, `locations`, `cost_estimates`
- Note: `users` and `share_tokens` tables are excluded from MVP (no authentication or sharing)

### Repository Structure

```
Link2itinerary/
├── README.md                          # Main project overview
├── LICENSE                            # Academic use license
├── .gitignore                         # Git ignore rules
│
├── frontend/                          # React UI (planned)
│   ├── README.md                      # Frontend architecture and planned pages
│   └── ux-flow.md                     # Detailed user experience flow
│
├── backend/                           # NestJS API (planned)
│   ├── README.md                      # Backend architecture and modules
│   └── api-contracts.md               # Complete API request/response specs
│
├── docs/                              # Course deliverables
│   ├── README.md                      # Documentation index
│   ├── SRS-outline.md                 # Software Requirements Specification template
│   ├── test-plan-outline.md           # Test plan with user stories and test cases
│   ├── architecture-overview.md       # System design and agentic workflow
│   ├── team-charter.md                # Roles, responsibilities, team norms
│   ├── status-report-template.md      # Weekly status report template
│   ├── status-reports/                # Folder for weekly reports
│   └── meeting-notes/                 # Folder for team meeting notes
│
└── db/                                # Database design
    ├── schema-plan.md                 # Complete database schema documentation
    └── ERD-notes.md                   # Entity-relationship diagram planning
```

---

## Key Documents to Review

### For Understanding the Project
1. **[README.md](./README.md)** - Start here! Project overview, team structure, tech stack
2. **[docs/SRS-outline.md](./docs/SRS-outline.md)** - Complete requirements specification
3. **[docs/architecture-overview.md](./docs/architecture-overview.md)** - System design and agentic workflow

### For Frontend Developers
1. **[frontend/README.md](./frontend/README.md)** - Planned pages and components
2. **[frontend/ux-flow.md](./frontend/ux-flow.md)** - Step-by-step user journey

### For Backend Developers
1. **[backend/README.md](./backend/README.md)** - Planned modules (Trips, Planner, Estimator) and endpoints
2. **[backend/api-contracts.md](./backend/api-contracts.md)** - Complete API request/response specifications
3. **[db/schema-plan.md](./db/schema-plan.md)** - Database schema with SQL (MVP tables only)

### For QA/Testing
1. **[docs/test-plan-outline.md](./docs/test-plan-outline.md)** - Test cases and acceptance criteria

### For Team Coordination
1. **[docs/team-charter.md](./docs/team-charter.md)** - Team roles and responsibilities
2. **[docs/status-report-template.md](./docs/status-report-template.md)** - Weekly reporting format

---

## Next Steps

### Immediate Actions
1. **Review all planning documents** - Each team member should read relevant docs
2. **Customize team information** - Update member names and roles in:
   - README.md
   - docs/team-charter.md
3. **Fill in placeholders** - Replace [bracketed] placeholders with actual info:
   - Academic year, university name
   - Team member names and contact info
   - OpenAI API key storage location

### Week 1 Tasks
- [ ] Hold kickoff meeting (use docs/meeting-notes/ template)
- [ ] Finalize team charter and get all signatures
- [ ] Review and refine SRS outline
- [ ] Set up communication channels (Slack/Discord)
- [ ] Set up project management tool (GitHub Projects/Trello)
- [ ] Create first status report (due Friday)

### Week 2 Tasks
- [ ] Initialize frontend: `npm create vite@latest frontend -- --template react-ts`
- [ ] Initialize backend: `nest new backend`
- [ ] Set up PostgreSQL database (local or hosted)
- [ ] Create GitHub repository and push skeleton
- [ ] Begin implementation of MVP core features:
  - Trip seed creation API
  - Teaser itinerary generation
  - Preferences collection
  - Full itinerary generation
  - Cost estimation

---

## Suggestions & Recommendations

### Project Management
- **Use GitHub Projects** - Create a board with columns: Backlog, In Progress, Review, Done
- **Create issues for each feature** - Link to relevant planning docs
- **Use pull request reviews** - Require 1 approval before merging

### Communication
- **Daily async standups** - Post in Slack/Discord: "Yesterday I..., Today I..., Blockers..."
- **Weekly sync meeting** - 1 hour, rotating facilitator
- **Document decisions** - Use meeting notes and update planning docs

### Development Workflow
1. Create feature branch: `git checkout -b feature/trip-seed-api`
2. Implement and test
3. Create pull request with clear description
4. Get review approval
5. Merge to `develop` branch
6. Deploy to `main` when ready for demo

### Documentation Maintenance
- **Keep docs updated** - When you change implementation, update planning docs
- **Use TODO comments** - Mark items for future work: `// TODO: Add error handling`
- **Write helpful commit messages** - "Add trip seed validation logic" not "fix stuff"

### Testing Strategy
- **Write tests as you go** - Don't defer to end
- **Aim for 70% coverage** - Focus on critical paths first
- **Manual test before PR** - Don't rely solely on automated tests

---

## Important Reminders

### Scope Management
- **Stick to MVP features** - Core MVP includes:
  - Trip seed creation from travel links (Airbnb, hotels, attractions)
  - Teaser itinerary generation (3-day quick overview)
  - Full itinerary generation with detailed day-by-day activities
  - User preferences collection (interests, budget, pace, dietary/accessibility)
  - Basic cost estimation with category breakdowns
- **Excluded from MVP** - The following features are explicitly NOT part of MVP:
  - Calendar export (ICS files)
  - Shareable itinerary links
  - Itinerary regeneration with version history
  - User authentication and accounts
  - Multiple cost tiers (budget/moderate/luxury)
- **Focus on demo-ready** - Prioritize features that show well in final presentation

### Time Management
- **Track hours** - Use status reports to monitor team velocity
- **Identify blockers early** - Don't wait until weekly meeting to raise issues
- **Buffer time for bugs** - Assume 20% of time will be bug fixes and polish

### Academic Requirements
- **Complete all deliverables** - SRS, test plan, architecture docs, status reports
- **Meet deadlines** - Check course syllabus for submission dates
- **Prepare for demos** - Practice presentations before class demos

---

## Resources

### Documentation Links
- All docs in `/docs/` folder
- API specs in `/backend/api-contracts.md`
- Database schema in `/db/schema-plan.md`

### External Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Tools
- [draw.io](https://app.diagrams.net/) - For ERD and architecture diagrams
- [dbdiagram.io](https://dbdiagram.io/) - Database schema visualization
- [Postman](https://www.postman.com/) - API testing
- [GitHub Projects](https://github.com/features/issues) - Project management

---

## Questions?

If you have questions about:
- **Project structure:** Review README.md and docs/README.md
- **Requirements:** See docs/SRS-outline.md
- **Architecture:** See docs/architecture-overview.md
- **Team process:** See docs/team-charter.md
- **Testing:** See docs/test-plan-outline.md

If still unclear, raise in team meeting or contact project lead.

---

## Success Criteria Checklist

At the end of the project, you should have:
- [ ] All course deliverables completed (SRS, test plan, architecture docs, status reports)
- [ ] Functional MVP deployed and accessible with complete user flow:
  - User can paste a travel link and create a trip seed
  - System generates a 3-day teaser itinerary
  - User can set preferences (interests, budget, pace, dietary/accessibility)
  - System generates a full personalized itinerary with day-by-day activities
  - System calculates and displays cost estimates with category breakdowns
- [ ] All core MVP user stories implemented (see SRS for complete list)
- [ ] Backend API with 3 modules: Trips, Planner, Estimator
- [ ] Frontend with 5 pages: Landing, Trip Seed Wizard, Teaser View, Preferences Wizard, Itinerary View
- [ ] Test coverage > 70% for critical paths
- [ ] Successful final demo showcasing the complete user journey
- [ ] Complete, up-to-date documentation aligned with MVP scope
- [ ] All team members contributed meaningfully

---

**Good luck, and happy coding!** 🚀

*This project skeleton was generated to provide a solid foundation for your academic software engineering project.*
