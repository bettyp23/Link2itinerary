# Frontend - Link2Itinerary UI

**About this file:** This README covers the frontend React application that users interact with. It outlines the five main pages (Landing, Trip Seed Wizard, Teaser View, Preferences Wizard, and Itinerary View), explains the component architecture, describes how data flows between the UI and backend API, and provides setup instructions. If you're building the user interface, components, or working on the user experience, start here.

React-based web application providing an intuitive interface for creating, customizing, and viewing AI-generated travel itineraries.

## Planned Pages

### 1. Landing / Home Page
- Hero section with value proposition
- Quick demo or sample itinerary
- "Get Started" CTA leading to Trip Seed Wizard
- Feature highlights (LLM-powered, budget-aware)

### 2. Trip Seed Wizard
**Route:** `/create/seed`

**Purpose:** Collect initial trip information from user

**Components:**
- URL input field (paste Airbnb/hotel/attraction link)
- Optional summary text area
- Link validation and metadata preview
- "Generate Teaser" button

**Data Flow:**
- POST `/api/trips/seed` with URL and summary
- Display loading state during scraping
- Show extracted metadata (location, dates, accommodation name)
- Auto-navigate to Teaser View on success

### 3. Teaser View Page
**Route:** `/trips/:id/teaser`

**Purpose:** Show quick 3-day overview to engage user

**Components:**
- Header with trip location and dates
- Three daily cards with themes and highlights
- Estimated cost range badge
- "Customize & Get Full Plan" button → Preferences Wizard
- "Start Over" button

**Data Flow:**
- GET `/api/trips/:id` for trip details
- POST `/api/planner/teaser` to generate teaser
- Display loading skeleton during generation

### 4. Preferences Wizard
**Route:** `/trips/:id/preferences`

**Purpose:** Collect detailed user preferences for personalized itinerary

**Components:**
- Multi-step form:
  - Step 1: Interests (museums, food, nightlife, nature, etc.)
  - Step 2: Budget preference (for cost estimation)
  - Step 3: Travel pace (relaxed/moderate/packed)
  - Step 4: Dietary restrictions and accessibility needs
- Progress indicator
- Back/Next navigation
- "Generate Itinerary" final button

**Data Flow:**
- PATCH `/api/trips/:id` to save preferences
- POST `/api/planner/full` to generate complete itinerary
- Navigate to Itinerary View on completion

### 5. Itinerary View Page
**Route:** `/trips/:id/itinerary`

**Purpose:** Display complete day-by-day itinerary

**Components:**
- Trip header (location, dates, cost summary)
- Day-by-day accordion or tab navigation
- Activity cards with:
  - Time, duration, title
  - Description and location
  - Estimated cost
  - Booking link (if available)
  - Map preview
- Cost breakdown sidebar

**Data Flow:**
- GET `/api/trips/:id` to fetch itinerary
- POST `/api/estimator/calculate` for cost breakdown

## Component Architecture

### Core Components

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── trip-seed/
│   │   ├── URLInputForm.tsx
│   │   ├── MetadataPreview.tsx
│   │   └── LinkValidator.tsx
│   ├── teaser/
│   │   ├── TeaserCard.tsx
│   │   ├── DayHighlights.tsx
│   │   └── CostBadge.tsx
│   ├── preferences/
│   │   ├── PreferencesForm.tsx
│   │   ├── InterestSelector.tsx
│   │   └── ProgressIndicator.tsx
│   ├── itinerary/
│   │   ├── ItineraryHeader.tsx
│   │   ├── DayAccordion.tsx
│   │   ├── ActivityCard.tsx
│   │   └── CostBreakdown.tsx
```

### State Management

**Approach:** React Context API + Custom Hooks (or Redux Toolkit if needed)

**Planned Contexts:**
- `TripContext` - Current trip data
- `ItineraryContext` - Current itinerary
- `PreferencesContext` - User preferences
- `UIContext` - Loading states, modals, toasts

**Custom Hooks:**
- `useTripSeed()` - Manage trip seed creation
- `useItinerary()` - Fetch itineraries
- `useCostEstimate()` - Calculate costs

## Data Flow Summary

```
1. User pastes link
   → URLInputForm
   → POST /api/trips/seed
   → MetadataPreview

2. User views teaser
   → TeaserCard
   → POST /api/planner/teaser
   → Navigate to Preferences Wizard

3. User sets preferences
   → PreferencesForm
   → PATCH /api/trips/:id
   → POST /api/planner/full
   → Navigate to Itinerary View

4. User views itinerary
   → DayAccordion + ActivityCard
   → GET /api/trips/:id
   → POST /api/estimator/calculate
   → Display itinerary with cost breakdown
```

## Technology Stack

- **Framework:** React 18+ with TypeScript
- **Routing:** React Router v6
- **State Management:** React Context API (or Redux Toolkit)
- **Styling:** Tailwind CSS or Material-UI (TBD)
- **HTTP Client:** Axios or Fetch API
- **Form Handling:** React Hook Form
- **Validation:** Zod or Yup
- **Date Handling:** date-fns or Day.js
- **Maps:** Google Maps API or Mapbox (for location previews)
- **Testing:** Vitest, React Testing Library
- **Build Tool:** Vite

## Development Setup (To Be Implemented)

```bash
# Install dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with API base URL

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Environment Variables (Planned)

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Directory Structure (Planned)

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── context/          # React contexts
│   ├── services/         # API clients
│   ├── utils/            # Utilities
│   ├── types/            # TypeScript types
│   ├── styles/           # Global styles
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Design System (To Be Defined)

- **Primary Color:** Blue/Teal (travel theme)
- **Secondary Color:** Orange/Coral (call-to-action)
- **Typography:** Modern sans-serif (Inter, Outfit, or similar)
- **Spacing:** 8px grid system
- **Breakpoints:** Mobile-first responsive design

## Accessibility Considerations

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG AA)

## Next Steps

1. Initialize React project: `npm create vite@latest frontend -- --template react-ts`
2. Set up routing and basic page structure
3. Create design system / component library
4. Implement Trip Seed Wizard
5. Build Teaser View
6. Implement Preferences Wizard
7. Build Itinerary View with cost breakdown
