/**
 * Response type for POST /api/planner/full
 * Matches frontend PlannerFullItinerary type
 */
export type PlannerFullItineraryResponse = {
  id: string;
  tripId: string;
  type: 'full';
  days: {
    date: string;
    activities: {
      id: string;
      time?: string;
      duration?: number;
      title: string;
      description?: string;
      location?: {
        name: string;
        address?: string;
        coordinates?: {
          lat: number;
          lng: number;
        };
      };
      category?: string;
      estimatedCost?: number;
      bookingUrl?: string | null;
      tips?: string[];
    }[];
    dailyTotal?: number;
  }[];
  totalEstimatedCost: {
    min: number;
    max: number;
    currency: string;
    breakdown?: {
      [category: string]: number;
    };
  };
  metadata?: {
    totalActivities?: number;
    totalDays?: number;
    preferences?: {
      interests?: string[];
      budget?: string;
      pace?: string;
      dietary?: string[];
      accessibility?: string[];
    };
  };
  generatedAt: string;
};
