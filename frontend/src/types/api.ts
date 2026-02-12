export type TripStatus =
  | "seed_created"
  | "teaser_generating"
  | "teaser_ready"
  | "full_generating"
  | "full_ready";

export type BudgetTier = "budget" | "moderate" | "luxury";
export type Pace = "relaxed" | "moderate" | "packed";

export type Preferences = {
  interests?: string[];
  budget?: BudgetTier;
  pace?: Pace;
  dietary?: string[];
  accessibility?: string[];
};

export type TripMetadata = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  accommodation?: {
    name?: string;
    type?: string;
  };
};

export type Trip = {
  id: string;
  url?: string;
  summary?: string;
  metadata?: TripMetadata;
  status?: TripStatus | string;
  preferences?: Preferences;
  createdAt?: string;
  updatedAt?: string;
  currentItinerary?: {
    id: string;
    status: string;
    generatedAt: string;
  } | null;
};

export type TeaserDay = {
  date: string;
  theme: string;
  highlights: string[];
};

export type MoneyRange = {
  min: number;
  max: number;
  currency: string;
};

export type PlannerTeaser = {
  id: string;
  tripId: string;
  type: "teaser";
  days: TeaserDay[];
  estimatedCost: MoneyRange;
  generatedAt: string;
  // Optional UX sugar – may or may not be present
  vibeTags?: string[];
  bestTimeToGo?: string;
};

export type ActivityLocation = {
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export type Activity = {
  id: string;
  time?: string;
  duration?: number;
  title: string;
  description?: string;
  location?: ActivityLocation;
  category?: string;
  estimatedCost?: number;
  bookingUrl?: string | null;
  tips?: string[];
};

export type ItineraryDay = {
  date: string;
  activities: Activity[];
  dailyTotal?: number;
};

export type CostBreakdown = {
  [category: string]: number;
};

export type TotalEstimatedCost = {
  min: number;
  max: number;
  currency: string;
  breakdown?: CostBreakdown;
};

export type PlannerFullItinerary = {
  id: string;
  tripId: string;
  type: "full";
  days: ItineraryDay[];
  totalEstimatedCost: TotalEstimatedCost;
  metadata?: {
    totalActivities?: number;
    totalDays?: number;
    preferences?: Preferences;
  };
  generatedAt: string;
};

export type CostEstimate = {
  itineraryId: string;
  totalCost: {
    min: number;
    max: number;
    average: number;
    currency: string;
  };
  breakdown: {
    [category: string]: {
      min: number;
      max: number;
    };
  };
  perDayAverage: number;
  calculatedAt: string;
};

