# Database Schema Plan
## Link2Itinerary

**Version:** 1.0 (Draft)
**Date:** [To be filled]
**Database:** PostgreSQL

---

## 1. Overview

This document outlines the planned database schema for Link2Itinerary, including tables, relationships, and key constraints.

### High-Level Entity Relationships

```
trip_seeds
  ↓ 1:N
itineraries
  ↓ 1:N
itinerary_days
  ↓ 1:N
activities

trip_seeds → preferences (1:1)
itineraries → cost_estimates (1:1)
activities → locations (N:1)
```

---

## 2. Tables

### 2.1 users (Future - Not MVP)

**Note:** User authentication is not part of MVP. This table will be added in future iterations when user accounts are implemented.

---

### 2.2 trip_seeds

Stores initial trip information from user-provided links.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique trip seed ID |
| url | TEXT | NOT NULL | Original user-provided link |
| summary | TEXT | | Optional user summary |
| location | VARCHAR(255) | NOT NULL | Extracted location (e.g., "Paris, France") |
| check_in | DATE | NOT NULL | Trip start date |
| check_out | DATE | NOT NULL | Trip end date |
| accommodation_name | VARCHAR(255) | | Extracted accommodation name |
| accommodation_type | VARCHAR(50) | | Type (e.g., "airbnb", "hotel") |
| metadata | JSONB | | Additional extracted data (flexible) |
| status | VARCHAR(50) | DEFAULT 'seed_created' | Status: seed_created, teaser_generated, itinerary_generated |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_trip_seeds_created_at` on `created_at`

**Sample Data:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://airbnb.com/rooms/12345",
  "summary": "Weekend getaway to Paris",
  "location": "Paris, France",
  "check_in": "2026-05-01",
  "check_out": "2026-05-05",
  "accommodation_name": "Charming apartment in Le Marais",
  "accommodation_type": "airbnb",
  "metadata": {
    "source_html_snippet": "...",
    "images": ["url1", "url2"]
  },
  "status": "seed_created"
}
```

---

### 2.3 preferences

Stores user preferences for itinerary generation (one per trip seed).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique preference ID |
| trip_seed_id | UUID | FOREIGN KEY (trip_seeds.id), UNIQUE | Associated trip seed |
| interests | TEXT[] | | Array of interests (e.g., ["museums", "food"]) |
| budget_tier | VARCHAR(50) | DEFAULT 'moderate' | budget, moderate, luxury |
| travel_pace | VARCHAR(50) | DEFAULT 'relaxed' | relaxed, moderate, packed |
| dietary_restrictions | TEXT[] | | Array of dietary needs (e.g., ["vegetarian"]) |
| accessibility_needs | TEXT[] | | Array of accessibility requirements |
| additional_notes | TEXT | | Free-form user notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_preferences_trip_seed_id` on `trip_seed_id`

**Sample Data:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "trip_seed_id": "550e8400-e29b-41d4-a716-446655440000",
  "interests": ["museums", "food", "architecture"],
  "budget_tier": "moderate",
  "travel_pace": "relaxed",
  "dietary_restrictions": [],
  "accessibility_needs": [],
  "additional_notes": "Prefer walking over public transport"
}
```

---

### 2.4 itineraries

Stores generated itineraries (teasers and full plans).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique itinerary ID |
| trip_seed_id | UUID | FOREIGN KEY (trip_seeds.id) | Associated trip seed |
| type | VARCHAR(50) | NOT NULL | teaser, full |
| status | VARCHAR(50) | DEFAULT 'generating' | generating, completed, failed |
| total_activities | INT | | Total number of activities |
| estimated_cost_min | DECIMAL(10,2) | | Minimum cost estimate (USD) |
| estimated_cost_max | DECIMAL(10,2) | | Maximum cost estimate (USD) |
| currency | VARCHAR(10) | DEFAULT 'USD' | Currency code |
| generated_at | TIMESTAMP | | When generation completed |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_itineraries_trip_seed_id` on `trip_seed_id`

**Sample Data:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "trip_seed_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "full",
  "status": "completed",
  "total_activities": 15,
  "estimated_cost_min": 480,
  "estimated_cost_max": 620,
  "currency": "USD",
  "generated_at": "2026-01-18T10:05:00Z"
}
```

---

### 2.5 itinerary_days

Stores individual days within an itinerary.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique day ID |
| itinerary_id | UUID | FOREIGN KEY (itineraries.id) | Associated itinerary |
| date | DATE | NOT NULL | Date of this day |
| day_number | INT | NOT NULL | Day number (1, 2, 3, ...) |
| theme | VARCHAR(255) | | Daily theme (e.g., "Museums & Culture") |
| highlights | TEXT[] | | Array of highlights (for teaser) |
| daily_cost_estimate | DECIMAL(10,2) | | Total cost for this day |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_itinerary_days_itinerary_id` on `itinerary_id`
- `idx_itinerary_days_date` on `itinerary_id, date` (composite)

**Constraints:**
- Unique constraint on `(itinerary_id, day_number)`

**Sample Data:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "itinerary_id": "770e8400-e29b-41d4-a716-446655440002",
  "date": "2026-05-01",
  "day_number": 1,
  "theme": "Arrival & Local Exploration",
  "highlights": ["Check-in", "Seine River walk", "Dinner at bistro"],
  "daily_cost_estimate": 45
}
```

---

### 2.6 activities

Stores individual activities within a day.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique activity ID |
| itinerary_day_id | UUID | FOREIGN KEY (itinerary_days.id) | Associated day |
| sequence_order | INT | NOT NULL | Order within the day (1, 2, 3, ...) |
| time | TIME | NOT NULL | Start time (e.g., "14:00") |
| duration | INT | NOT NULL | Duration in minutes |
| title | VARCHAR(255) | NOT NULL | Activity title |
| description | TEXT | | Detailed description |
| category | VARCHAR(50) | | Category: accommodation, dining, sightseeing, transport, etc. |
| location_id | UUID | FOREIGN KEY (locations.id) | Associated location (nullable) |
| estimated_cost | DECIMAL(10,2) | DEFAULT 0 | Cost estimate for this activity |
| booking_url | TEXT | | Link to book/reserve (if available) |
| tips | TEXT[] | | Array of tips (e.g., ["Bring camera", "Reserve ahead"]) |
| metadata | JSONB | | Additional flexible data |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_activities_itinerary_day_id` on `itinerary_day_id`
- `idx_activities_sequence` on `itinerary_day_id, sequence_order` (composite)

**Constraints:**
- Unique constraint on `(itinerary_day_id, sequence_order)`

**Sample Data:**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "itinerary_day_id": "880e8400-e29b-41d4-a716-446655440003",
  "sequence_order": 1,
  "time": "14:00",
  "duration": 60,
  "title": "Check-in at Le Marais Apartment",
  "description": "Arrive at your accommodation, settle in, and get oriented.",
  "category": "accommodation",
  "location_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "estimated_cost": 0,
  "booking_url": null,
  "tips": [],
  "metadata": {}
}
```

---

### 2.7 locations

Stores location information (reusable across activities).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique location ID |
| name | VARCHAR(255) | NOT NULL | Location name (e.g., "Louvre Museum") |
| address | TEXT | | Full address |
| city | VARCHAR(100) | | City name |
| country | VARCHAR(100) | | Country name |
| latitude | DECIMAL(9,6) | | Latitude coordinate |
| longitude | DECIMAL(9,6) | | Longitude coordinate |
| place_type | VARCHAR(50) | | Type: restaurant, museum, hotel, landmark, etc. |
| metadata | JSONB | | Additional data (hours, phone, website) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_locations_name` on `name`
- `idx_locations_coords` on `latitude, longitude` (for proximity searches)

**Sample Data:**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "name": "Louvre Museum",
  "address": "Rue de Rivoli, 75001 Paris",
  "city": "Paris",
  "country": "France",
  "latitude": 48.8606,
  "longitude": 2.3376,
  "place_type": "museum",
  "metadata": {
    "opening_hours": "9:00-18:00",
    "website": "https://www.louvre.fr"
  }
}
```

---

### 2.8 cost_estimates

Stores detailed cost breakdowns for itineraries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique estimate ID |
| itinerary_id | UUID | FOREIGN KEY (itineraries.id), UNIQUE | Associated itinerary |
| total_min | DECIMAL(10,2) | NOT NULL | Total minimum cost |
| total_max | DECIMAL(10,2) | NOT NULL | Total maximum cost |
| total_average | DECIMAL(10,2) | | Average cost |
| dining_min | DECIMAL(10,2) | DEFAULT 0 | Dining category min |
| dining_max | DECIMAL(10,2) | DEFAULT 0 | Dining category max |
| activities_min | DECIMAL(10,2) | DEFAULT 0 | Activities category min |
| activities_max | DECIMAL(10,2) | DEFAULT 0 | Activities category max |
| transportation_min | DECIMAL(10,2) | DEFAULT 0 | Transport category min |
| transportation_max | DECIMAL(10,2) | DEFAULT 0 | Transport category max |
| shopping_min | DECIMAL(10,2) | DEFAULT 0 | Shopping category min |
| shopping_max | DECIMAL(10,2) | DEFAULT 0 | Shopping category max |
| miscellaneous_min | DECIMAL(10,2) | DEFAULT 0 | Misc category min |
| miscellaneous_max | DECIMAL(10,2) | DEFAULT 0 | Misc category max |
| currency | VARCHAR(10) | DEFAULT 'USD' | Currency code |
| calculated_at | TIMESTAMP | DEFAULT NOW() | Calculation time |

**Indexes:**
- `idx_cost_estimates_itinerary_id` on `itinerary_id`

**Sample Data:**
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "itinerary_id": "770e8400-e29b-41d4-a716-446655440002",
  "total_min": 480,
  "total_max": 620,
  "total_average": 550,
  "dining_min": 180,
  "dining_max": 240,
  "activities_min": 150,
  "activities_max": 180,
  "transportation_min": 50,
  "transportation_max": 70,
  "shopping_min": 50,
  "shopping_max": 80,
  "miscellaneous_min": 50,
  "miscellaneous_max": 50,
  "currency": "USD"
}
```

---

## 3. Relationships Summary

### One-to-Many (1:N)
- `trip_seeds → itineraries` (one seed can have one itinerary)
- `itineraries → itinerary_days`
- `itinerary_days → activities`
- `locations → activities` (one location can be used by many activities)

### One-to-One (1:1)
- `trip_seeds → preferences` (each seed has one preference set)
- `itineraries → cost_estimates` (each itinerary has one cost breakdown)

---

## 4. Entity-Relationship Diagram (ERD)

**Planned Tool:** draw.io or dbdiagram.io

**Placeholder Description:**
```
┌────────────┐       ┌─────────────┐
│ trip_seeds │◄──────┤ preferences │
└─────┬──────┘ 1:1   └─────────────┘
      │ 1:N
      ▼
┌─────────────┐      ┌────────────────┐
│ itineraries │◄─────┤ cost_estimates │
└──────┬──────┘ 1:1  └────────────────┘
       │ 1:N
       ▼
┌────────────────┐
│ itinerary_days │
└────────┬───────┘
         │ 1:N
         ▼
┌───────────┐
│ activities│
└─────┬─────┘
      │ N:1
      ▼
┌───────────┐
│ locations │
└───────────┘
```

**To be created:** Visual ERD diagram (image or link)

---

## 5. Data Types & Constraints

### UUID vs. Auto-increment IDs
- **Decision:** Use UUIDs for all primary keys
- **Rationale:**
  - Prevents enumeration attacks on public endpoints
  - Easier to merge data from multiple sources
  - No coordination needed for distributed systems (future)

### Timestamps
- **created_at:** Automatically set on insert
- **updated_at:** Automatically updated on modify (via trigger or ORM)

### JSONB for Flexibility
- Use JSONB for `metadata` fields where schema may evolve
- Allows flexibility without frequent migrations
- PostgreSQL indexes on JSONB for performance

### Enums vs. VARCHAR
- Use VARCHAR for status fields (easier to extend)
- Document valid values in code/docs

---

## 6. Indexing Strategy

### Primary Indexes
- All primary keys (id) automatically indexed

### Foreign Key Indexes
- All foreign keys indexed for join performance

### Query-specific Indexes
- `trip_seeds.created_at` for recent trips query
- `locations.latitude, locations.longitude` for proximity searches

---

## 7. Sample Queries

### Get Trip Seed with Itinerary
```sql
SELECT ts.*, i.*, p.*
FROM trip_seeds ts
LEFT JOIN preferences p ON ts.id = p.trip_seed_id
LEFT JOIN itineraries i ON ts.id = i.trip_seed_id
WHERE ts.id = '550e8400-e29b-41d4-a716-446655440000';
```

### Get Full Itinerary with Activities
```sql
SELECT i.*, d.*, a.*, l.*
FROM itineraries i
JOIN itinerary_days d ON i.id = d.itinerary_id
JOIN activities a ON d.id = a.itinerary_day_id
LEFT JOIN locations l ON a.location_id = l.id
WHERE i.id = '770e8400-e29b-41d4-a716-446655440002'
ORDER BY d.day_number, a.sequence_order;
```


---

## 8. Migrations Plan

### Migration Strategy
- Use TypeORM or Prisma migrations
- Version-controlled migration files
- Separate migrations for schema changes

### Planned Migrations
1. **Initial schema:** Create all tables
2. **Indexes:** Add performance indexes
3. **Future:** Add users table when auth is implemented

---

## 9. Data Seeding (for Testing)

### Seed Data
- 3-5 sample trip seeds with realistic data
- 2 full itineraries with activities
- Sample locations in Paris, Tokyo, NYC

### Seeding Script
- SQL file: `db/seeds/initial-data.sql`
- Or ORM seeding script (e.g., `npm run seed`)

---

## 10. Backup & Maintenance

### Backup Strategy (Future)
- Daily automated backups of PostgreSQL database
- Retention: 7 days for MVP, longer for production

### Maintenance Tasks
- Archive old trip seeds (if user accounts added in future)

---

## 11. Security Considerations

### Data Protection
- SQL injection prevention via parameterized queries (ORM handles this)

### Access Control
- For MVP: No user authentication, limited security
- Future: Row-level security (RLS) to ensure users only access their trips

---

## Appendix A: SQL Schema (Draft)

```sql
-- Trip seeds
CREATE TABLE trip_seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  summary TEXT,
  location VARCHAR(255) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  accommodation_name VARCHAR(255),
  accommodation_type VARCHAR(50),
  metadata JSONB,
  status VARCHAR(50) DEFAULT 'seed_created',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Preferences
CREATE TABLE preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_seed_id UUID REFERENCES trip_seeds(id) ON DELETE CASCADE UNIQUE,
  interests TEXT[],
  budget_tier VARCHAR(50) DEFAULT 'moderate',
  travel_pace VARCHAR(50) DEFAULT 'relaxed',
  dietary_restrictions TEXT[],
  accessibility_needs TEXT[],
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Itineraries
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_seed_id UUID REFERENCES trip_seeds(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'generating',
  total_activities INT,
  estimated_cost_min DECIMAL(10,2),
  estimated_cost_max DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Itinerary days
CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_number INT NOT NULL,
  theme VARCHAR(255),
  highlights TEXT[],
  daily_cost_estimate DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(itinerary_id, day_number)
);

-- Locations
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  place_type VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
  sequence_order INT NOT NULL,
  time TIME NOT NULL,
  duration INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  booking_url TEXT,
  tips TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(itinerary_day_id, sequence_order)
);

-- Cost estimates
CREATE TABLE cost_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE UNIQUE,
  total_min DECIMAL(10,2) NOT NULL,
  total_max DECIMAL(10,2) NOT NULL,
  total_average DECIMAL(10,2),
  dining_min DECIMAL(10,2) DEFAULT 0,
  dining_max DECIMAL(10,2) DEFAULT 0,
  activities_min DECIMAL(10,2) DEFAULT 0,
  activities_max DECIMAL(10,2) DEFAULT 0,
  transportation_min DECIMAL(10,2) DEFAULT 0,
  transportation_max DECIMAL(10,2) DEFAULT 0,
  shopping_min DECIMAL(10,2) DEFAULT 0,
  shopping_max DECIMAL(10,2) DEFAULT 0,
  miscellaneous_min DECIMAL(10,2) DEFAULT 0,
  miscellaneous_max DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trip_seeds_created_at ON trip_seeds(created_at);
CREATE INDEX idx_preferences_trip_seed_id ON preferences(trip_seed_id);
CREATE INDEX idx_itineraries_trip_seed_id ON itineraries(trip_seed_id);
CREATE INDEX idx_itinerary_days_itinerary_id ON itinerary_days(itinerary_id);
CREATE INDEX idx_activities_itinerary_day_id ON activities(itinerary_day_id);
CREATE INDEX idx_locations_name ON locations(name);
CREATE INDEX idx_locations_coords ON locations(latitude, longitude);
CREATE INDEX idx_cost_estimates_itinerary_id ON cost_estimates(itinerary_id);
```

---

## Appendix B: TypeORM Entities (Example)

```typescript
// Example: TripSeed entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('trip_seeds')
export class TripSeed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accommodationName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accommodationType: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object;

  @Column({ type: 'varchar', length: 50, default: 'seed_created' })
  status: string;

  @OneToMany(() => Itinerary, itinerary => itinerary.tripSeed)
  itineraries: Itinerary[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

(Additional entities would follow similar pattern)
