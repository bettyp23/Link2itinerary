import { Body, Controller, Post } from '@nestjs/common';
import { EstimatorService } from './estimator.service';
import { CalculateEstimateDto } from './dto/calculate-estimate.dto';
import type { CostEstimateResponse } from './types/cost-estimate-response';

/**
 * Handles cost estimation requests.
 * Route prefix: /api/estimator
 */
@Controller('api/estimator')
export class EstimatorController {
  constructor(private readonly estimatorService: EstimatorService) {}

  /**
   * POST /api/estimator/calculate
   *
   * Accepts an itineraryId and optional trip context, returns a detailed
   * cost breakdown by category.
   *
   * Minimal request body: { "itineraryId": "uuid-string" }
   * Extended body:        { "itineraryId": "uuid", "numDays": 5, "baseDailyCost": 200 }
   */
  @Post('calculate')
  calculate(@Body() dto: CalculateEstimateDto): CostEstimateResponse {
    return this.estimatorService.calculate(dto);
  }
}
