# Running the Full Application

**Purpose:** This guide explains how to run both the frontend and backend together for a complete working MVP.

## Quick Start

### Prerequisites
- Node.js v18+ installed
- npm installed
- Access to Supabase database (for backend)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
# Install Planner module dependencies (OpenAI SDK and Cheerio for web scraping)
npm install openai cheerio @types/cheerio
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend:**
1. Copy the environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` and add:
   - `DATABASE_URL` - Supabase connection string (get from Supabase Dashboard → Connect button → Session Pooler URI)
   - `OPENAI_API_KEY` - Optional, needed for Planner module to generate itineraries (get from OpenAI dashboard)

**Frontend:**
1. Create `.env` file (if `.env.example` doesn't exist, create `.env` with this content):
   ```bash
   cd frontend
   # If .env.example exists:
   cp .env.example .env
   
   # If .env.example doesn't exist, create .env manually with:
   # VITE_API_BASE_URL=http://localhost:3000/api
   # VITE_USE_MOCKS=false
   ```

2. Edit `.env` if needed (defaults work for local development):
   - `VITE_API_BASE_URL=http://localhost:3000/api` (matches backend port)
   - `VITE_USE_MOCKS=false` (set to `true` to use mock data without backend)

### Step 3: Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run start:dev
```

**Expected output:**
```
[Nest] LOG [NestApplication] Nest application successfully started
```

**Backend runs on:** http://localhost:3000

### Step 4: Start Frontend Server

**Terminal 2 (new terminal window):**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend runs on:** http://localhost:5173

### Step 5: Verify Connection

1. Open browser to http://localhost:5173
2. You should see the Landing Page
3. Click "Get Started" to navigate to Trip Seed page
4. Try creating a trip seed
5. Check browser console (F12) - should see successful API calls (no CORS errors)

## Port Configuration

- **Backend:** Port 3000 (configurable via `PORT` in `backend/.env`)
- **Frontend:** Port 5173 (Vite default, configurable in `frontend/vite.config.ts`)

## Troubleshooting

### Backend won't start

**"Unable to connect to the database"**
- Check `backend/.env` file exists
- Verify `DATABASE_URL` is correct (use pooler format, not direct connection)
- Ensure Supabase project is active

**"Port 3000 already in use"**
- Change `PORT=3001` in `backend/.env`
- Update `frontend/.env` to match: `VITE_API_BASE_URL=http://localhost:3001/api`

### Frontend can't connect to backend

**CORS errors in browser console**
- Verify backend is running (check Terminal 1)
- Verify backend CORS is enabled (should be in `backend/src/main.ts`)
- Check `VITE_API_BASE_URL` in `frontend/.env` matches backend port

**"Failed to fetch" errors**
- Backend may not be running - check Terminal 1
- Verify backend started successfully (look for "Nest application successfully started")
- Try accessing backend directly: http://localhost:3000/api/trips (should return `[]` or trip data)

### Using Mock Data (Backend Not Available)

If backend is not available, you can use mock data:

1. Edit `frontend/.env`:
   ```env
   VITE_USE_MOCKS=true
   ```

2. Restart frontend server

3. Frontend will use mock data instead of API calls

## Testing the Full Flow

1. **Landing Page** (`/`)
   - Should display hero section
   - Click "Get Started" button

2. **Trip Seed Page** (`/create/seed`)
   - Enter a URL (e.g., `https://airbnb.com/rooms/12345`)
   - Optionally add summary
   - Click "Generate Teaser"
   - Should create trip and navigate to Teaser page

3. **Teaser Page** (`/trips/:id/teaser`)
   - Should display 3-day overview
   - Click "Customize & Get Full Plan"

4. **Preferences Page** (`/trips/:id/preferences`)
   - Fill out preferences form
   - Click "Generate Itinerary"

5. **Itinerary Page** (`/trips/:id/itinerary`)
   - Should display full day-by-day itinerary
   - Should show cost breakdown

## Development Workflow

**For active development:**
- Both servers support hot reload
- Backend: Changes to `.ts` files auto-restart server
- Frontend: Changes to `.tsx` files auto-refresh browser

**To stop servers:**
- Press `Ctrl+C` in each terminal

## Next Steps

Once both are running:
- Test all 5 pages
- Verify API calls work (check Network tab in browser DevTools)
- Test full user flow: Landing → Trip Seed → Teaser → Preferences → Itinerary
- Report any issues or errors
