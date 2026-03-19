Project: Link2Itinerary Frontend
Framework: React (Create React App)
Started: 2026-02-12
Session 1 — Initial React Scaffold (2026-02-12)

What was done:

Set up local frontend environment
Installed Node.js and npm to support React development.
Followed the Cursor tutorial shared by Myles (Create React App workflow - https://youtu.be/pjMooEnzEQs?si=dFocvrhH8mzRKQ2J).
Scaffolded a basic React application
Created under frontend/app.
Command used: npx create-react-app .
This generated the standard CRA structure (src/, public/, package.json, etc.).
Verified local development server
Ran npm start.
Confirmed the app runs at http://localhost:3000.
Verified hot reload works (editing src/App.js updates the browser automatically).
Current frontend structure:
frontend/

_docs/ (existing planning documents)
app/ (React application)
public/
src/
package.json
other CRA-generated files
For teammates — getting started:
cd frontend/app
npm install
npm start

Notes:

This is a basic scaffold only. No routing, pages, or backend integration has been implemented yet.
Created to ensure the frontend has a runnable baseline aligned with the shared tutorial.
If the team prefers a different framework (e.g., Vite or Next.js), this scaffold can be replaced before feature development begins.
Next steps (frontend):
Add routing for the 5-page structure.
Define initial component and folder organization.
Connect to backend /api/trips endpoints.
Implement Trip Seed form submission.






---

## Session — Frontend Auth Flow (2026-03-18)

### What was done:

Implemented a frontend-only authentication system to support gated user flows.

Added AuthContext
- Created `src/context/AuthContext.tsx`
- Stores `user` and derives `isAuthenticated`
- Provides `login` and `logout` functions
- Persists user in localStorage (session survives refresh)

Integrated AuthProvider
- Wrapped the app in `AuthProvider` (in `App.tsx`)
- Makes auth state available across all pages and components

Added Login page
- Created `src/pages/LoginPage.tsx`
- Email/password form using `useState`
- Calls `login()` from AuthContext
- Redirects after login

Added /login route
- Registered in `App.tsx`

Integrated auth into header
- Updated `AppHeader.tsx`
- Logged out: shows "Login" link
- Logged in: shows user name + "Logout" button

Added ProtectedRoute
- Created `src/components/ProtectedRoute.tsx`
- Blocks access to protected pages if not authenticated
- Redirects to `/login`
- Stores original destination for redirect-after-login

Protected trip planning flow
- Wrapped `/trips/:tripId/preferences` route with `ProtectedRoute`
- Teaser remains public
- Preferences and beyond require login

Added return-to login behavior
- Updated `LoginPage.tsx` to read redirect target from `location.state`
- After login:
  - returns user to intended page if present
  - otherwise defaults to `/`

---

### User flow:

Not logged in:
Teaser → "Plan full trip" → Login → Preferences

Logged in:
Teaser → "Plan full trip" → Preferences

---

### Notes:

- This is a frontend-only (mock) authentication system
- No backend integration yet
- Designed to be easily replaced with real API-based auth later
- Uses localStorage for persistence

---

### Next steps (auth-related):

- Replace mock login with backend API (`/auth/login`)
- Add signup flow
- Add token handling (JWT)
- Consider protecting additional routes if needed