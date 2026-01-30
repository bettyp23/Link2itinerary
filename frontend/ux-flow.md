# User Experience Flow

Visual walkthrough of the user journey through Link2Itinerary.

## Overview

```
Landing Page → Trip Seed Wizard → Teaser View → Preferences Wizard → Itinerary View
```

---

## Step 1: Landing Page

**Goal:** Introduce the product and get users to try it

**User sees:**
- Hero headline: "Turn any travel link into a personalized itinerary"
- Subheading: "Paste an Airbnb, hotel, or attraction URL and get an AI-powered travel plan in seconds"
- "Get Started" button
- Sample itinerary preview (optional)

**User action:**
- Clicks "Get Started" → Navigates to Trip Seed Wizard

---

## Step 2: Trip Seed Wizard

**Goal:** Capture initial trip information with minimal friction

**User sees:**
- Clean form with single large input field
- Placeholder: "Paste your Airbnb, hotel, or attraction link here..."
- Optional text area: "Add a quick summary (optional)"
- "Generate Teaser" button

**User action:**
1. Pastes link (e.g., `https://airbnb.com/rooms/12345`)
2. Optionally adds summary: "Weekend getaway to Paris"
3. Clicks "Generate Teaser"

**System behavior:**
- Shows loading indicator: "Analyzing your link..."
- Extracts metadata (location, dates, accommodation)
- Displays preview card:
  - "We found: Paris, France"
  - "Check-in: May 1, 2026"
  - "Check-out: May 5, 2026"
  - "Charming apartment in Le Marais"
- Auto-generates teaser in background
- Redirects to Teaser View

---

## Step 3: Teaser View

**Goal:** Hook the user with a quick, exciting preview

**User sees:**
- Trip header: "Your Paris Adventure: May 1-5, 2026"
- Three daily cards:

  **Day 1: Arrival & Local Exploration**
  - Check-in at Le Marais apartment
  - Stroll along Seine River
  - Dinner at local bistro

  **Day 2: Museums & Culture**
  - Morning at Louvre Museum
  - Lunch in Latin Quarter
  - Evening at Musée d'Orsay

  **Day 3: Food & Shopping**
  - Food market tour
  - Shopping on Champs-Élysées
  - Farewell dinner with Eiffel Tower view

- Cost estimate badge: "Estimated: $400-600"
- Two action buttons:
  - Primary: "Customize & Get Full Plan" (large, prominent)
  - Secondary: "Start Over" (smaller)

**User action:**
- Clicks "Customize & Get Full Plan" → Navigates to Preferences Wizard

---

## Step 4: Preferences Wizard

**Goal:** Collect detailed preferences for personalized itinerary

**User sees:**
- Multi-step form with progress indicator (Step 1 of 4)

### Step 1: Interests
- Question: "What are you most interested in?"
- Checkboxes:
  - ☑ Museums & Art
  - ☑ Food & Dining
  - ☑ Architecture
  - ☐ Nightlife
  - ☐ Nature & Parks
  - ☐ Shopping
  - ☐ History & Culture
- "Next" button

### Step 2: Budget
- Question: "What's your budget preference?"
- Note: "This helps us estimate costs for your itinerary"
- Radio buttons:
  - ● Moderate - "Balanced quality and value" (pre-selected)
- "Back" and "Next" buttons

### Step 3: Travel Pace
- Question: "What's your preferred travel pace?"
- Radio buttons:
  - ● Relaxed - "2-3 activities per day, plenty of downtime"
  - ○ Moderate - "3-4 activities, balanced schedule"
  - ○ Packed - "5+ activities, maximize every moment"
- "Back" and "Next" buttons

### Step 4: Special Needs
- Question: "Any dietary or accessibility requirements?"
- Checkboxes:
  - ☐ Vegetarian
  - ☐ Vegan
  - ☐ Gluten-free
  - ☐ Wheelchair accessible
  - ☐ Family-friendly (with kids)
- Text area: "Other notes..."
- "Back" and "Generate Itinerary" buttons

**User action:**
1. Selects interests: Museums, Food, Architecture
2. Chooses budget: Moderate
3. Chooses pace: Relaxed
4. Skips special needs
5. Clicks "Generate Itinerary"

**System behavior:**
- Shows loading screen with progress messages:
  - "Analyzing your preferences..."
  - "Finding the best activities..."
  - "Optimizing your schedule..."
  - "Calculating costs..."
- Generates full itinerary (may take 10-30 seconds)
- Redirects to Itinerary View

---

## Step 5: Itinerary View

**Goal:** Present complete, actionable itinerary

**User sees:**

### Header Section
- Trip title: "Paris, France: May 1-5, 2026"
- Cost summary: "Total Estimated Cost: $480-620"

### Day-by-Day Breakdown
Expandable accordion for each day:

**Day 1 - Thursday, May 1**
- Daily total: $45

  **2:00 PM - Check-in at Le Marais Apartment** (1 hour)
  - Arrive at your accommodation, settle in, and get oriented.
  - 📍 123 Rue de Rivoli, 75004 Paris
  - 💰 Free
  - [View on map]

  **4:00 PM - Seine River Walk** (2 hours)
  - Leisurely stroll along the Seine, taking in views of Notre-Dame.
  - 📍 Quai de la Tournelle, 75005 Paris
  - 💰 Free
  - 💡 Tip: Bring a camera for sunset photos

  **7:00 PM - Dinner at Le Comptoir du Relais** (1.5 hours)
  - Traditional French bistro known for coq au vin.
  - 📍 9 Carrefour de l'Odéon, 75006 Paris
  - 💰 $45
  - [Book now] [View on map]
  - 💡 Tip: Reservations recommended

**Day 2 - Friday, May 2**
- Daily total: $120
- [Activity cards continue...]

### Sidebar (Desktop) / Bottom Section (Mobile)
**Cost Breakdown**
- Dining: $180-240
- Activities: $150-180
- Transportation: $50-70
- Miscellaneous: $50-80
- **Total: $480-620**

**User action:**
- User can view the complete itinerary with all activities and cost breakdown
- User can navigate back to start a new trip if desired

---

## Edge Cases & Error Handling

### Invalid URL
**Scenario:** User pastes non-travel link
- Show error: "We couldn't recognize this link. Please paste an Airbnb, hotel, or attraction URL."
- Allow retry

### LLM Generation Failure
**Scenario:** API timeout or error during generation
- Show friendly error: "Oops! We're having trouble generating your itinerary. Please try again."
- "Retry" button
- Option to contact support

---

## Mobile Considerations

- Single-column layout for all pages
- Bottom sheet modals instead of centered modals
- Sticky action buttons at bottom of screen
- Simplified map previews (tap to expand)
- Collapsible sections to reduce scrolling

---

## Accessibility Flow

- All steps navigable via keyboard (Tab, Enter, Arrow keys)
- Screen reader announcements for loading states
- Focus management when navigating between steps
- Skip links to main content
- High contrast mode support

---

## Summary

The user journey is designed to be:
1. **Fast:** Teaser in seconds, full itinerary in under 30 seconds
2. **Intuitive:** Clear progression from link → teaser → preferences → itinerary
3. **Personalized:** Preferences-driven itinerary generation
4. **Cost-aware:** Transparent cost estimates and breakdowns
5. **Wow-inducing:** Immediate value with teaser, deep personalization with full plan
