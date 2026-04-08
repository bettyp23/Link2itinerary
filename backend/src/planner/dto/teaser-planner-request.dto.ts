import { IsString, IsUUID } from 'class-validator';

/**
 * DTO for POST /api/planner/teaser
 * Request body: { "tripId": "uuid-string" }
 */
export class TeaserPlannerRequestDto {
  @IsString()
  @IsUUID()
  tripId!: string;
}
