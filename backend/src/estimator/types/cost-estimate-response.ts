/**
 * Cost range for a single spending category.
 */
export interface CategoryRange {
  min: number;
  max: number;
}

/**
 * Response type for POST /api/estimator/calculate
 * Matches the frontend CostEstimate type in frontend/src/types/api.ts
 */
export interface CostEstimateResponse {
  itineraryId: string;
  totalCost: {
    min: number;
    max: number;
    average: number;
    currency: 'USD';
  };
  breakdown: {
    accommodation: CategoryRange;
    dining: CategoryRange;
    activities: CategoryRange;
    transportation: CategoryRange;
    shopping: CategoryRange;
    miscellaneous: CategoryRange;
  };
  perDayAverage: number;
  calculatedAt: string;
}
