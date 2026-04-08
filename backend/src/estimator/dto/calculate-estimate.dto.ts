import { IsString, IsUUID, IsOptional, IsNumber, IsPositive } from 'class-validator';

/**
 * DTO for POST /api/estimator/calculate
 *
 * The frontend sends only the itineraryId. The optional numDays and
 * baseDailyCost fields allow callers to pass trip context when available,
 * improving the accuracy of the deterministic estimate.
 *
 * Request body (minimal): { "itineraryId": "uuid-string" }
 */
export class CalculateEstimateDto {
  /** The ID of the itinerary to estimate costs for */
  @IsString()
  @IsUUID()
  itineraryId!: string;

  /**
   * Number of days in the itinerary.
   * Defaults to 3 if not provided.
   */
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numDays?: number;

  /**
   * Base daily spend in USD (overrides the default $150/day).
   * Derived from totalEstimatedCost if the caller passes it.
   */
  @IsOptional()
  @IsNumber()
  @IsPositive()
  baseDailyCost?: number;
}
