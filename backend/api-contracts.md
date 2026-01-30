# API Contracts

Detailed request/response specifications for all Link2Itinerary API endpoints.

## Trip Seeds API

### POST /api/trips/seed

Create a new trip seed from a user-provided link.

**Request:**
```json
{
  "url": "https://airbnb.com/rooms/12345",
  "summary": "Weekend getaway to Paris",
  "preferences": {
    "interests": ["museums", "food"],
    "budget": "moderate",
    "pace": "relaxed"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "trip-uuid-123",
  "url": "https://airbnb.com/rooms/12345",
  "summary": "Weekend getaway to Paris",
  "metadata": {
    "location": "Paris, France",
    "checkIn": "2026-05-01",
    "checkOut": "2026-05-05",
    "accommodation": {
      "name": "Charming apartment in Le Marais",
      "type": "airbnb"
    }
  },
  "status": "seed_created",
  "createdAt": "2026-01-18T10:00:00Z"
}
```

### GET /api/trips/:id

Retrieve trip details and current itinerary status.

**Response (200 OK):**
```json
{
  "id": "trip-uuid-123",
  "url": "...",
  "summary": "...",
  "metadata": { ... },
  "currentItinerary": {
    "id": "itinerary-uuid-456",
    "status": "completed",
    "generatedAt": "2026-01-18T10:05:00Z"
  },
  "preferences": { ... },
  "createdAt": "...",
  "updatedAt": "..."
}
```

### PATCH /api/trips/:id

Update trip preferences.

**Request:**
```json
{
  "preferences": {
    "interests": ["museums", "food", "nightlife"],
    "budget": "luxury",
    "dietary": ["vegetarian"]
  }
}
```

**Response (200 OK):**
```json
{
  "id": "trip-uuid-123",
  "preferences": { ... },
  "updatedAt": "2026-01-18T10:10:00Z"
}
```

### DELETE /api/trips/:id

Delete a trip seed and all associated itineraries.

**Response (200 OK):**
```json
{
  "message": "Trip deleted successfully",
  "deletedId": "trip-uuid-123"
}
```

---

## Planner API

### POST /api/planner/teaser

Generate a quick teaser itinerary (3-day overview).

**Request:**
```json
{
  "tripId": "trip-uuid-123"
}
```

**Response (200 OK):**
```json
{
  "id": "teaser-uuid-789",
  "tripId": "trip-uuid-123",
  "type": "teaser",
  "days": [
    {
      "date": "2026-05-01",
      "theme": "Arrival & Local Exploration",
      "highlights": [
        "Check-in at Le Marais apartment",
        "Stroll along Seine River",
        "Dinner at local bistro"
      ]
    },
    {
      "date": "2026-05-02",
      "theme": "Museums & Culture",
      "highlights": [
        "Morning at Louvre Museum",
        "Lunch in Latin Quarter",
        "Evening at Musée d'Orsay"
      ]
    },
    {
      "date": "2026-05-03",
      "theme": "Food & Shopping",
      "highlights": [
        "Food market tour",
        "Shopping on Champs-Élysées",
        "Farewell dinner with Eiffel Tower view"
      ]
    }
  ],
  "estimatedCost": {
    "min": 400,
    "max": 600,
    "currency": "USD"
  },
  "generatedAt": "2026-01-18T10:02:00Z"
}
```

### POST /api/planner/full

Generate a complete personalized itinerary with detailed activities.

**Request:**
```json
{
  "tripId": "trip-uuid-123",
  "preferences": {
    "interests": ["museums", "food", "architecture"],
    "budget": "moderate",
    "pace": "relaxed",
    "dietary": [],
    "accessibility": []
  }
}
```

**Response (200 OK):**
```json
{
  "id": "itinerary-uuid-456",
  "tripId": "trip-uuid-123",
  "type": "full",
  "days": [
    {
      "date": "2026-05-01",
      "activities": [
        {
          "id": "activity-1",
          "time": "14:00",
          "duration": 60,
          "title": "Check-in at Le Marais Apartment",
          "description": "Arrive at your accommodation, settle in, and get oriented.",
          "location": {
            "name": "Charming apartment in Le Marais",
            "address": "123 Rue de Rivoli, 75004 Paris",
            "coordinates": { "lat": 48.8566, "lng": 2.3522 }
          },
          "category": "accommodation",
          "estimatedCost": 0,
          "bookingUrl": null
        },
        {
          "id": "activity-2",
          "time": "16:00",
          "duration": 120,
          "title": "Seine River Walk",
          "description": "Leisurely stroll along the Seine, taking in views of Notre-Dame and historic bridges.",
          "location": {
            "name": "Seine Riverbank",
            "address": "Quai de la Tournelle, 75005 Paris",
            "coordinates": { "lat": 48.8534, "lng": 2.3488 }
          },
          "category": "sightseeing",
          "estimatedCost": 0,
          "tips": ["Bring a camera for sunset photos", "Stop at bouquinistes (book stalls)"]
        },
        {
          "id": "activity-3",
          "time": "19:00",
          "duration": 90,
          "title": "Dinner at Le Comptoir du Relais",
          "description": "Traditional French bistro known for coq au vin and crème brûlée.",
          "location": {
            "name": "Le Comptoir du Relais",
            "address": "9 Carrefour de l'Odéon, 75006 Paris",
            "coordinates": { "lat": 48.8516, "lng": 2.3387 }
          },
          "category": "dining",
          "estimatedCost": 45,
          "bookingUrl": "https://example.com/restaurant",
          "tips": ["Reservations recommended", "Try the duck confit"]
        }
      ],
      "dailyTotal": 45
    }
  ],
  "totalEstimatedCost": {
    "min": 420,
    "max": 580,
    "currency": "USD",
    "breakdown": {
      "dining": 180,
      "activities": 150,
      "transportation": 50,
      "miscellaneous": 40
    }
  },
  "metadata": {
    "totalActivities": 15,
    "totalDays": 5,
    "preferences": { ... }
  },
  "generatedAt": "2026-01-18T10:05:00Z"
}
```

---

## Cost Estimator API

### POST /api/estimator/calculate

Calculate cost estimates for an itinerary.

**Request:**
```json
{
  "itineraryId": "itinerary-uuid-456"
}
```

**Response (200 OK):**
```json
{
  "itineraryId": "itinerary-uuid-456",
  "totalCost": {
    "min": 480,
    "max": 620,
    "average": 550,
    "currency": "USD"
  },
  "breakdown": {
    "dining": { "min": 180, "max": 240 },
    "activities": { "min": 150, "max": 180 },
    "transportation": { "min": 50, "max": 70 },
    "shopping": { "min": 50, "max": 80 },
    "miscellaneous": { "min": 50, "max": 50 }
  },
  "perDayAverage": 110,
  "calculatedAt": "2026-01-18T10:08:00Z"
}
```

---

## Error Responses

All endpoints may return standard error responses:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "url",
      "message": "Invalid URL format"
    }
  ]
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Trip not found",
  "error": "Not Found"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "LLM provider unavailable",
  "error": "Internal Server Error"
}
```
