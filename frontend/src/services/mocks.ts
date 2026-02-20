import type {
  Trip,
  Preferences,
  PlannerTeaser,
  PlannerFullItinerary,
  CostEstimate,
  ItineraryDay,
  Activity
} from "../types/api";

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function makeMockTripId() {
  return `trip-mock-${Math.random().toString(36).slice(2, 8)}`;
}

function inferLocationFromSummary(summary: string | undefined) {
  if (!summary) return "Your destination";
  const lower = summary.toLowerCase();
  if (lower.includes("tulum")) return "Tulum, Mexico";
  if (lower.includes("paris")) return "Paris, France";
  if (lower.includes("new york") || lower.includes("nyc"))
    return "New York City, USA";
  return "Your destination";
}

export async function mockCreateTripSeed(params: {
  url?: string;
  summary: string;
  preferences?: Preferences;
}): Promise<Trip> {
  const id = makeMockTripId();
  const now = new Date().toISOString();
  const location = inferLocationFromSummary(params.summary);
  const trip: Trip = {
    id,
    url: params.url,
    summary: params.summary,
    metadata: {
      location,
      checkIn: "2026-05-01",
      checkOut: "2026-05-04",
      accommodation: {
        name: "Sample stay near the spots in your link",
        type: "airbnb"
      }
    },
    preferences: params.preferences,
    status: "seed_created",
    createdAt: now,
    updatedAt: now,
    currentItinerary: null
  };
  return delay(trip, 600);
}

export async function mockGetTrip(id: string): Promise<Trip> {
  const now = new Date().toISOString();
  const trip: Trip = {
    id,
    url: "https://example.com/mock",
    summary: "Mock trip generated in frontend mock mode.",
    metadata: {
      location: "Mock City",
      checkIn: "2026-05-01",
      checkOut: "2026-05-03",
      accommodation: {
        name: "Mock Apartment Downtown",
        type: "hotel"
      }
    },
    status: "seed_created",
    createdAt: now,
    updatedAt: now,
    currentItinerary: null
  };
  return delay(trip, 250);
}

export async function mockUpdateTripPreferences(params: {
  id: string;
  preferences: Preferences;
}): Promise<Trip> {
  const now = new Date().toISOString();
  const trip: Trip = {
    id: params.id,
    summary: "Mock trip with saved preferences.",
    metadata: {
      location: "Mock City",
      checkIn: "2026-05-01",
      checkOut: "2026-05-05"
    },
    preferences: params.preferences,
    status: "teaser_ready",
    createdAt: now,
    updatedAt: now,
    currentItinerary: {
      id: "itinerary-mock-1",
      status: "completed",
      generatedAt: now
    }
  };
  return delay(trip, 300);
}

export async function mockGenerateTeaser(tripId: string): Promise<PlannerTeaser> {
  const baseDate = new Date("2026-05-01T00:00:00Z");
  const days = [0, 1, 2].map((offset, idx): PlannerTeaser["days"][number] => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + offset);
    const dateStr = d.toISOString().slice(0, 10);
    const themes = [
      "Arrival & Local Exploration",
      "Highlights & Must‑sees",
      "Food, Views & Wrap‑up"
    ];
    const highlightsByIndex: string[][] = [
      [
        "Check-in and settle into your stay",
        "Walk around the area from your link",
        "Casual dinner nearby"
      ],
      [
        "Hit the most iconic spot from the video",
        "Explore a nearby neighborhood",
        "Evening viewpoint or sunset"
      ],
      [
        "Slow morning at a cafe",
        "Browse local shops or markets",
        "Farewell dinner with a view"
      ]
    ];
    return {
      date: dateStr,
      theme: themes[idx],
      highlights: highlightsByIndex[idx]
    };
  });

  const teaser: PlannerTeaser = {
    id: "teaser-mock-1",
    tripId,
    type: "teaser",
    days,
    estimatedCost: {
      min: 400,
      max: 650,
      currency: "USD"
    },
    generatedAt: new Date().toISOString(),
    vibeTags: ["relaxed", "food-forward", "photo spots"],
    bestTimeToGo: "Late spring or early fall for mild weather"
  };

  return delay(teaser, 800);
}

function buildMockActivities(date: string): Activity[] {
  return [
    {
      id: `${date}-1`,
      time: "09:00",
      duration: 120,
      title: "Slow breakfast near your stay",
      description:
        "Ease into the day with coffee and a light breakfast at a spot close to where your video was filmed.",
      location: {
        name: "Local cafe",
        address: "Short walk from your accommodation"
      },
      category: "dining",
      estimatedCost: 18,
      tips: ["Ask for a table outside if weather allows."]
    },
    {
      id: `${date}-2`,
      time: "11:30",
      duration: 180,
      title: "Explore the main area from your video",
      description:
        "Follow the spots highlighted in the video: key streets, viewpoints, or landmarks featured.",
      location: {
        name: "Key neighborhood",
        address: "Center of the area from your link"
      },
      category: "sightseeing",
      estimatedCost: 0,
      tips: ["Pause where the video spends the most time; that’s often a highlight."]
    },
    {
      id: `${date}-3`,
      time: "18:30",
      duration: 120,
      title: "Dinner with a view",
      description:
        "Wrap up the day at a restaurant with a nice view or atmosphere that matches the vibe of your video.",
      location: {
        name: "Recommended restaurant",
        address: "Short ride from your stay"
      },
      category: "dining",
      estimatedCost: 45,
      bookingUrl: "https://example.com/booking",
      tips: ["Book ahead for golden hour if possible."]
    }
  ];
}

export async function mockGenerateFullItinerary(params: {
  tripId: string;
  preferences: Preferences;
}): Promise<PlannerFullItinerary> {
  const baseDate = new Date("2026-05-01T00:00:00Z");
  const days: ItineraryDay[] = [0, 1, 2].map((offset) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + offset);
    const dateStr = d.toISOString().slice(0, 10);
    const activities = buildMockActivities(dateStr);
    const dailyTotal = activities.reduce(
      (sum, act) => sum + (act.estimatedCost ?? 0),
      0
    );
    return {
      date: dateStr,
      activities,
      dailyTotal
    };
  });

  const min = 480;
  const max = 620;

  const itinerary: PlannerFullItinerary = {
    id: "itinerary-mock-1",
    tripId: params.tripId,
    type: "full",
    days,
    totalEstimatedCost: {
      min,
      max,
      currency: "USD",
      breakdown: {
        dining: 220,
        activities: 150,
        transportation: 80,
        miscellaneous: 50
      }
    },
    metadata: {
      totalActivities: days.reduce(
        (sum, d) => sum + d.activities.length,
        0
      ),
      totalDays: days.length,
      preferences: params.preferences
    },
    generatedAt: new Date().toISOString()
  };

  return delay(itinerary, 1200);
}

export async function mockCalculateCostEstimate(
  itineraryId: string
): Promise<CostEstimate> {
  const totalMin = 480;
  const totalMax = 620;
  const estimate: CostEstimate = {
    itineraryId,
    totalCost: {
      min: totalMin,
      max: totalMax,
      average: Math.round((totalMin + totalMax) / 2),
      currency: "USD"
    },
    breakdown: {
      dining: { min: 180, max: 240 },
      activities: { min: 150, max: 180 },
      transportation: { min: 50, max: 70 },
      shopping: { min: 50, max: 80 },
      miscellaneous: { min: 50, max: 50 }
    },
    perDayAverage: Math.round(totalMin / 3),
    calculatedAt: new Date().toISOString()
  };

  return delay(estimate, 500);
}

