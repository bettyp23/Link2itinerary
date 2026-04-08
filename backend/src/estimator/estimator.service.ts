import { Injectable } from '@nestjs/common';
import { CalculateEstimateDto } from './dto/calculate-estimate.dto';
import { CostEstimateResponse, CategoryRange } from './types/cost-estimate-response';

/**
 * Category spending weights — must sum to 1.0
 *
 * Based on typical travel budget splits:
 *   Dining        35%   (meals, cafes, drinks)
 *   Activities    25%   (museums, tours, experiences)
 *   Transportation 15%  (local transit, taxis, rideshares)
 *   Shopping      15%   (souvenirs, clothes, gifts)
 *   Miscellaneous 10%   (tips, toiletries, unexpected costs)
 */
const CATEGORY_WEIGHTS = {
  dining: 0.35,
  activities: 0.25,
  transportation: 0.15,
  shopping: 0.15,
  miscellaneous: 0.10,
} as const;

/** Default spend per person per day in USD when no override is provided */
const DEFAULT_DAILY_COST = 150;

/** Variance factor applied to produce min/max range (±15%) */
const VARIANCE = 0.15;

@Injectable()
export class EstimatorService {

  /**
   * Calculate a deterministic cost estimate for an itinerary.
   *
   * Since itineraries are not yet persisted to the database, this method
   * derives all numbers from the request parameters (numDays + baseDailyCost)
   * using fixed category percentages. No external calls are made — the estimate
   * is computed purely from arithmetic.
   *
   * Formula:
   *   totalBase    = numDays × baseDailyCost
   *   categoryBase = totalBase × weight
   *   min          = categoryBase × (1 − VARIANCE)
   *   max          = categoryBase × (1 + VARIANCE)
   */
  calculate(dto: CalculateEstimateDto): CostEstimateResponse {
    const numDays = dto.numDays ?? 3;
    const baseDailyCost = dto.baseDailyCost ?? DEFAULT_DAILY_COST;

    const totalBase = numDays * baseDailyCost;

    // Build per-category min/max ranges
    const breakdown = Object.fromEntries(
      Object.entries(CATEGORY_WEIGHTS).map(([category, weight]) => {
        const categoryBase = totalBase * weight;
        const range: CategoryRange = {
          min: Math.round(categoryBase * (1 - VARIANCE)),
          max: Math.round(categoryBase * (1 + VARIANCE)),
        };
        return [category, range];
      }),
    ) as CostEstimateResponse['breakdown'];

    // Total cost aggregated from all categories
    const totalMin = Object.values(breakdown).reduce((sum, r) => sum + r.min, 0);
    const totalMax = Object.values(breakdown).reduce((sum, r) => sum + r.max, 0);
    const average = Math.round((totalMin + totalMax) / 2);
    const perDayAverage = Math.round(average / numDays);

    return {
      itineraryId: dto.itineraryId,
      totalCost: {
        min: totalMin,
        max: totalMax,
        average,
        currency: 'USD',
      },
      breakdown,
      perDayAverage,
      calculatedAt: new Date().toISOString(),
    };
  }
}
