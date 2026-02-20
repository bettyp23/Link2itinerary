import type {
  Trip,
  Preferences,
  PlannerTeaser,
  PlannerFullItinerary,
  CostEstimate
} from "../types/api";
import {
  mockCalculateCostEstimate,
  mockCreateTripSeed,
  mockGenerateFullItinerary,
  mockGenerateTeaser,
  mockGetTrip,
  mockUpdateTripPreferences
} from "./mocks";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    let errorDetail: unknown = null;
    if (contentType?.includes("application/json")) {
      errorDetail = await res.json().catch(() => null);
    } else {
      errorDetail = await res.text().catch(() => null);
    }
    const error = new Error("API request failed");
    (error as any).status = res.status;
    (error as any).detail = errorDetail;
    throw error;
  }
  return (await res.json()) as T;
}

export async function createTripSeed(params: {
  url?: string;
  summary: string;
  preferences?: Preferences;
}): Promise<Trip> {
  if (USE_MOCKS) {
    return mockCreateTripSeed(params);
  }
  const res = await fetch(`${API_BASE_URL}/trips/seed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  return handleResponse<Trip>(res);
}

export async function getTrip(id: string): Promise<Trip> {
  if (USE_MOCKS) {
    return mockGetTrip(id);
  }
  const res = await fetch(`${API_BASE_URL}/trips/${encodeURIComponent(id)}`);
  return handleResponse<Trip>(res);
}

export async function updateTripPreferences(params: {
  id: string;
  preferences: Preferences;
}): Promise<Trip> {
  if (USE_MOCKS) {
    return mockUpdateTripPreferences(params);
  }
  const res = await fetch(`${API_BASE_URL}/trips/${encodeURIComponent(
    params.id
  )}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ preferences: params.preferences })
  });
  return handleResponse<Trip>(res);
}

export async function generateTeaser(tripId: string): Promise<PlannerTeaser> {
  if (USE_MOCKS) {
    return mockGenerateTeaser(tripId);
  }
  const res = await fetch(`${API_BASE_URL}/planner/teaser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tripId })
  });
  return handleResponse<PlannerTeaser>(res);
}

export async function generateFullItinerary(params: {
  tripId: string;
  preferences: Preferences;
}): Promise<PlannerFullItinerary> {
  if (USE_MOCKS) {
    return mockGenerateFullItinerary(params);
  }
  const res = await fetch(`${API_BASE_URL}/planner/full`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tripId: params.tripId,
      preferences: params.preferences
    })
  });
  return handleResponse<PlannerFullItinerary>(res);
}

export async function calculateCostEstimate(
  itineraryId: string
): Promise<CostEstimate> {
  if (USE_MOCKS) {
    return mockCalculateCostEstimate(itineraryId);
  }
  const res = await fetch(`${API_BASE_URL}/estimator/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ itineraryId })
  });
  return handleResponse<CostEstimate>(res);
}

