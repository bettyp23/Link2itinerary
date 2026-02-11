import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';

/**
 * DTO for updating an existing trip seed.
 *
 * All fields are optional because PATCH requests only send the fields
 * that are changing, not the entire object.
 *
 * Example request body:
 * {
 *   "summary": "Updated trip description",
 *   "accommodationType": "hotel"
 * }
 */
export class UpdateTripSeedDto {
  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  accommodationName?: string;

  @IsOptional()
  @IsIn(['airbnb', 'hotel', 'hostel', 'resort', 'other'])
  accommodationType?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
