import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculateEstimateDto } from './dto/calculate-estimate.dto';
import { CostEstimateResponse, CategoryRange } from './types/cost-estimate-response';
import { ItineraryCache } from '../itinerary-cache/entities/itinerary-cache.entity';
import { TripSeed } from '../trips/entities/trip-seed.entity';

type BudgetLevel = 'budget' | 'moderate' | 'luxury';

// ── Per-night accommodation rates (USD) by budget level ──────────────────────
const NIGHTLY_RATES: Record<BudgetLevel, CategoryRange> = {
  budget:   { min: 30,  max: 65  },
  moderate: { min: 90,  max: 170 },
  luxury:   { min: 220, max: 500 },
};

// ── Multipliers for accommodation type ───────────────────────────────────────
// Applied to the base nightly rate to reflect real-world pricing differences
const ACC_TYPE_MULTIPLIER: Record<string, number> = {
  hostel:           0.4,
  airbnb:           1.0,
  vacation_rental:  1.0,
  apartment:        0.9,
  hotel:            1.2,
  boutique_hotel:   1.5,
  resort:           2.2,
};

// ── Dining estimates per person per day ──────────────────────────────────────
const DINING_PER_DAY: Record<BudgetLevel, CategoryRange> = {
  budget:   { min: 20,  max: 35  },
  moderate: { min: 45,  max: 80  },
  luxury:   { min: 100, max: 200 },
};

// ── Local transportation estimates per day ───────────────────────────────────
// (buses, taxis, rideshares — excludes flights)
const TRANSPORT_PER_DAY: Record<BudgetLevel, CategoryRange> = {
  budget:   { min: 5,  max: 15 },
  moderate: { min: 15, max: 35 },
  luxury:   { min: 40, max: 90 },
};

// ── Shopping & souvenirs estimate for entire trip ────────────────────────────
const SHOPPING_PER_TRIP: Record<BudgetLevel, CategoryRange> = {
  budget:   { min: 0,   max: 60   },
  moderate: { min: 50,  max: 250  },
  luxury:   { min: 200, max: 1000 },
};

@Injectable()
export class EstimatorService {
  constructor(
    @InjectRepository(ItineraryCache)
    private readonly itineraryCacheRepo: Repository<ItineraryCache>,
    @InjectRepository(TripSeed)
    private readonly tripSeedRepo: Repository<TripSeed>,
  ) {}

  async calculate(dto: CalculateEstimateDto): Promise<CostEstimateResponse> {
    // ── 1. Pull real context from the database ────────────────────────────────
    let budget: BudgetLevel = 'moderate';
    let numDays = dto.numDays ?? 3;
    let numNights = numDays - 1;
    let accommodationType: string | null = null;
    let activityCostTotal = 0;

    const cached = await this.itineraryCacheRepo.findOne({ where: { id: dto.itineraryId } });

    if (cached) {
      // Budget level from preferences
      const prefs = cached.preferences as Record<string, any>;
      if (prefs?.budget && ['budget', 'moderate', 'luxury'].includes(prefs.budget)) {
        budget = prefs.budget as BudgetLevel;
      }

      // Sum actual activity costs from the stored itinerary payload
      const payload = cached.payload as Record<string, any>;
      if (Array.isArray(payload?.days)) {
        numDays = payload.days.length;
        numNights = numDays - 1;
        activityCostTotal = payload.days.reduce((daySum: number, day: any) => {
          return daySum + (Array.isArray(day.activities) ? day.activities.reduce(
            (actSum: number, act: any) => actSum + (Number(act.estimatedCost) || 0), 0,
          ) : 0);
        }, 0);
      }

      // Get trip seed for accommodation type and real check-in/out dates
      if (cached.tripSeedId) {
        const tripSeed = await this.tripSeedRepo.findOne({ where: { id: cached.tripSeedId } });
        if (tripSeed) {
          accommodationType = tripSeed.accommodationType ?? null;

          if (tripSeed.checkIn && tripSeed.checkOut) {
            const checkIn = new Date(tripSeed.checkIn);
            const checkOut = new Date(tripSeed.checkOut);
            numNights = Math.max(1, Math.round(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
            ));
            numDays = numNights + 1;
          }
        }
      }
    }

    const nights = Math.max(1, numNights);
    const days  = Math.max(1, numDays);

    // ── 2. Calculate accommodation ────────────────────────────────────────────
    const nightlyBase = NIGHTLY_RATES[budget];
    const accMultiplier = accommodationType
      ? (ACC_TYPE_MULTIPLIER[accommodationType.toLowerCase()] ?? 1.0)
      : 1.0;

    const accommodation: CategoryRange = {
      min: Math.round(nightlyBase.min * accMultiplier * nights),
      max: Math.round(nightlyBase.max * accMultiplier * nights),
    };

    // ── 3. Activities — use real summed costs ±10% as the range ───────────────
    const activities: CategoryRange = activityCostTotal > 0
      ? {
          min: Math.round(activityCostTotal * 0.90),
          max: Math.round(activityCostTotal * 1.10),
        }
      : {
          // Fallback when no cost data: rough budget-based estimate
          min: { budget: 20, moderate: 50, luxury: 120 }[budget] * days,
          max: { budget: 50, moderate: 120, luxury: 300 }[budget] * days,
        };

    // ── 4. Dining, transport, shopping ───────────────────────────────────────
    const dining: CategoryRange = {
      min: DINING_PER_DAY[budget].min * days,
      max: DINING_PER_DAY[budget].max * days,
    };
    const transportation: CategoryRange = {
      min: TRANSPORT_PER_DAY[budget].min * days,
      max: TRANSPORT_PER_DAY[budget].max * days,
    };
    const shopping: CategoryRange = { ...SHOPPING_PER_TRIP[budget] };

    // ── 5. Miscellaneous — 5% buffer on subtotal ─────────────────────────────
    const subMin = accommodation.min + activities.min + dining.min + transportation.min + shopping.min;
    const subMax = accommodation.max + activities.max + dining.max + transportation.max + shopping.max;
    const miscellaneous: CategoryRange = {
      min: Math.round(subMin * 0.05),
      max: Math.round(subMax * 0.05),
    };

    const breakdown = { accommodation, dining, activities, transportation, shopping, miscellaneous };
    const totalMin = subMin + miscellaneous.min;
    const totalMax = subMax + miscellaneous.max;
    const average = Math.round((totalMin + totalMax) / 2);

    return {
      itineraryId: dto.itineraryId,
      totalCost: { min: totalMin, max: totalMax, average, currency: 'USD' },
      breakdown,
      perDayAverage: Math.round(average / days),
      calculatedAt: new Date().toISOString(),
    };
  }
}
