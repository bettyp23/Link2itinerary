# Software Requirements Specification (SRS)
## Link2Itinerary

**Version:** 1.0 (Draft)
**Date:** [To be filled]
**Authors:** Link2Itinerary Team
**Course:** CEN4090L - Software Engineering II

---

## 1. Introduction

### 1.1 Purpose
[Describe the purpose of this SRS document and its intended audience]

### 1.2 Scope
**Product Name:** Link2Itinerary

**Product Description:**
[One-paragraph description of what Link2Itinerary does and its key value proposition]

**Key Features:**
- Trip seed creation from travel links
- AI-powered itinerary generation
- Budget-aware planning with cost estimates
- Personalized preferences and customization

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| Trip Seed | Initial trip information extracted from a user-provided link |
| Teaser | Quick 3-day overview itinerary |
| Full Itinerary | Complete day-by-day plan with detailed activities |
| LLM | Large Language Model (AI used for planning) |
| ICS | iCalendar format for calendar exports |
| Cost Tier | Budget category (budget/moderate/luxury) |

### 1.4 References
- [Backend API Contracts](../backend/api-contracts.md)
- [Frontend UX Flow](../frontend/ux-flow.md)
- [Database Schema Plan](../db/schema-plan.md)

### 1.5 Overview
[Brief overview of the rest of this document]

---

## 2. Overall Description

### 2.1 Product Perspective
[Describe how Link2Itinerary fits into the broader context of travel planning tools]

**System Context:**
- Web-based application (frontend + backend)
- Integrates with hosted LLM providers (OpenAI, Anthropic)
- Uses external APIs for location data and cost estimates
- Standalone system (not integrated with existing platforms)

### 2.2 Product Functions

**High-level capabilities:**
1. Extract trip metadata from travel links
2. Generate AI-powered itineraries
3. Personalize based on user preferences
4. Estimate costs with breakdown by category
5. Export to calendar format
6. Share itineraries publicly
7. Regenerate itineraries with updated preferences

### 2.3 User Classes and Characteristics

**Primary Users:**
- **Casual Travelers:** Planning vacations, need quick inspiration
- **First-time Visitors:** Unfamiliar with destination, want structured plans
- **Budget-conscious Travelers:** Need cost estimates before committing

**User Expertise:**
- No technical expertise required
- Familiar with basic web applications
- Comfortable with copy/paste operations

### 2.4 Operating Environment

**Client-side:**
- Modern web browsers (Chrome, Firefox, Safari, Edge)
- Desktop and mobile responsive design
- Internet connection required

**Server-side:**
- Node.js runtime (v18+)
- PostgreSQL database
- Hosted LLM API access (OpenAI, Anthropic)

### 2.5 Design and Implementation Constraints

**Technical Constraints:**
- Must use hosted LLMs (no local model deployment for MVP)
- API rate limits from LLM providers
- Response time targets: <30 seconds for full itinerary

**Business Constraints:**
- Academic project timeline (one semester)
- Limited budget for API usage
- For academic use only (not commercial)

**Regulatory Constraints:**
- User privacy (no PII storage for MVP)
- Compliance with LLM provider terms of service

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have access to travel links (Airbnb, hotels, etc.)
- LLM providers maintain stable API access
- Basic trip information is extractable from links

**Dependencies:**
- OpenAI or Anthropic API availability
- Third-party APIs for location/cost data (if used)
- Cloud hosting platform (AWS, Vercel, Railway)

---

## 3. System Features

### 3.1 Trip Seed Creation

**Priority:** High
**Description:** Allow users to create trip seeds from travel links

#### 3.1.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | System shall accept URLs from Airbnb, hotels, and attraction websites | High |
| FR-1.2 | System shall extract location, dates, and accommodation metadata from links | High |
| FR-1.3 | System shall validate URL format before processing | Medium |
| FR-1.4 | System shall display extracted metadata for user confirmation | Medium |
| FR-1.5 | System shall allow optional summary text input | Low |

### 3.2 Teaser Itinerary Generation

**Priority:** High
**Description:** Generate quick 3-day overview to engage users

#### 3.2.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | System shall generate teaser within 10 seconds | High |
| FR-2.2 | Teaser shall include 3 daily themes and highlights | High |
| FR-2.3 | Teaser shall provide estimated cost range | Medium |
| FR-2.4 | Teaser shall be generated using LLM with structured prompts | High |

### 3.3 Preferences Collection

**Priority:** High
**Description:** Collect user preferences for personalized itineraries

#### 3.3.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | System shall collect interest categories (museums, food, etc.) | High |
| FR-3.2 | System shall offer budget tiers (budget, moderate, luxury) | High |
| FR-3.3 | System shall collect travel pace preference | Medium |
| FR-3.4 | System shall collect dietary restrictions and accessibility needs | Low |
| FR-3.5 | Preferences shall be stored and editable | Medium |

### 3.4 Full Itinerary Generation

**Priority:** High
**Description:** Generate complete day-by-day personalized itinerary

#### 3.4.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | System shall generate full itinerary within 30 seconds | High |
| FR-4.2 | Each activity shall include time, duration, title, description, location | High |
| FR-4.3 | Each activity shall include estimated cost | Medium |
| FR-4.4 | Activities shall be logically ordered and geographically optimized | Medium |
| FR-4.5 | System shall validate itinerary consistency (no overlaps, realistic timing) | High |
| FR-4.6 | Itinerary shall reflect user preferences | High |

### 3.5 Cost Estimation

**Priority:** Medium
**Description:** Provide detailed cost breakdowns by category

#### 3.5.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | System shall calculate total estimated cost | High |
| FR-5.2 | System shall break down costs by category (dining, activities, transport) | Medium |
| FR-5.3 | System shall provide cost ranges (min/max) | Medium |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**UI-1:** Web-based responsive interface
**UI-2:** Mobile-friendly design (320px - 1920px)
**UI-3:** Accessibility compliance (WCAG AA)
**UI-4:** Modern, clean aesthetic with intuitive navigation

See [Frontend UX Flow](../frontend/ux-flow.md) for detailed mockups.

### 4.2 Hardware Interfaces

Not applicable (web-based application).

### 4.3 Software Interfaces

| Interface | Description | Data Format |
|-----------|-------------|-------------|
| OpenAI API | LLM for itinerary generation | JSON (REST) |
| PostgreSQL | Data persistence | SQL |
| [Optional] Google Maps API | Location data and maps | JSON (REST) |

### 4.4 Communications Interfaces

**Protocol:** HTTPS
**Data Format:** JSON
**Authentication:** API keys for LLMs (no user authentication in MVP)

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | Teaser generation response time | < 10 seconds |
| NFR-1.2 | Full itinerary generation response time | < 30 seconds |
| NFR-1.3 | Page load time | < 3 seconds |
| NFR-1.4 | Concurrent user support | 50+ users (MVP) |

### 5.2 Safety Requirements

- System shall not expose user data to unauthorized parties
- System shall validate all user inputs to prevent injection attacks
- System shall handle LLM API failures gracefully

### 5.3 Security Requirements

| ID | Requirement |
|----|-------------|
| NFR-2.1 | All API communications shall use HTTPS |
| NFR-2.2 | API keys shall be stored securely (environment variables) |
| NFR-2.3 | User inputs shall be sanitized to prevent XSS/SQL injection |

### 5.4 Software Quality Attributes

**Usability:**
- Intuitive flow with minimal learning curve
- Clear error messages and guidance
- Responsive design for all screen sizes

**Reliability:**
- 95% uptime during development/demo
- Graceful degradation when LLM API is unavailable

**Maintainability:**
- Modular architecture (NestJS modules, React components)
- Comprehensive documentation
- TypeScript for type safety

**Scalability:**
- Architecture supports horizontal scaling (future)
- Database queries optimized for performance

---

## 6. Other Requirements

### 6.1 Legal Requirements

- Compliance with LLM provider terms of service
- Academic use only (no commercial deployment without license changes)
- Attribution to data sources (if using external APIs)

### 6.2 Ethical Considerations

- Transparent about AI-generated content
- Clear indication that itineraries are suggestions, not guaranteed plans
- No hidden costs or misleading pricing information

---

## Appendix A: User Stories

### Epic 1: Trip Seed Creation
- **US-1.1:** As a user, I want to paste an Airbnb link and see trip details, so I can quickly start planning.
- **US-1.2:** As a user, I want to see extracted metadata before proceeding, so I can verify accuracy.

### Epic 2: Itinerary Generation
- **US-2.1:** As a user, I want to see a teaser itinerary in seconds, so I can decide if I want a full plan.
- **US-2.2:** As a user, I want to customize my preferences, so my itinerary matches my interests.
- **US-2.3:** As a user, I want a detailed day-by-day plan, so I know exactly what to do each day.

### Epic 3: Cost Management
- **US-3.1:** As a user, I want to see estimated costs, so I can plan my budget.
- **US-3.2:** As a user, I want to see cost breakdowns by category, so I understand where my money goes.

---

## Appendix B: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [Date] | Team | Initial draft |
| 1.0 | [Date] | Team | Complete SRS for review |
