/**
 * Response type for POST /api/planner/teaser
 * Matches the frontend PlannerTeaser type in frontend/src/types/api.ts
 */
export type PlannerTeaserResponse = {
  id: string;
  tripId: string;
  type: 'teaser';
  days: {
    date: string;
    theme: string;
    highlights: string[];
  }[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  generatedAt: string;
  vibeTags?: string[];
  bestTimeToGo?: string;
};
