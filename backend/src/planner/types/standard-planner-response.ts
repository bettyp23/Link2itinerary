//// These are TypeScript types for the response shape.
//// They are not DTOs because they are returned by the server,
//// not validated as incoming input.

//// Each activity block inside a day.
export type PlannerActivity = {
  time: string;            //// Format example: "09:00"
  duration: number;        //// Duration in minutes
  title: string;
  description: string;
  location: string;
  estimatedCost: number;   //// Can be 0 for MVP
  bookingUrl: string;      //// Can be empty string "" for MVP
};

//// A single day in the itinerary.
export type PlannerDay = {
  date: string;            //// Format example: "2026-05-01"
  activities: PlannerActivity[];
};

//// Full Standard Planner Response format.
export type StandardPlannerResponse = {
  itinerary: {
    id: string;            //// UUID
    tripId: string;        //// "trip-uuid"
    days: PlannerDay[];
    totalEstimatedCost: {
      min: number;         //// For estimator module
      max: number;         //// For estimator module
      currency: string;    //// Usually "USD"
    };
  };
};

