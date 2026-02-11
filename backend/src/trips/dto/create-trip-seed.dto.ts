import {
  IsUrl,
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  IsIn,
} from 'class-validator';

/**
 * DTO for creating a new trip seed.
 *
 * DTOs (Data Transfer Objects) define the shape of incoming request data
 * and validate it automatically. If a request doesn't match these rules,
 * NestJS returns a 400 Bad Request before your code even runs.
 *
 * Example request body:
 * {
 *   "url": "https://airbnb.com/rooms/12345",
 *   "summary": "Weekend getaway to Paris",
 *   "location": "Paris, France",
 *   "checkIn": "2026-05-01",
 *   "checkOut": "2026-05-05",
 *   "accommodationName": "Charming apartment in Le Marais",
 *   "accommodationType": "airbnb"
 * }
 */
export class CreateTripSeedDto {
  /** Must be a valid URL (e.g., an Airbnb or hotel listing link) */
  @IsUrl()
  url: string;

  /** Optional short description of the trip */
  @IsOptional()
  @IsString()
  summary?: string;

  /** Where the trip takes place (e.g., "Paris, France") */
  @IsString()
  location: string;

  /** Trip start date in ISO format (YYYY-MM-DD) */
  @IsDateString()
  checkIn: string;

  /** Trip end date in ISO format (YYYY-MM-DD) */
  @IsDateString()
  checkOut: string;

  /** Name of the accommodation (extracted or user-provided) */
  @IsOptional()
  @IsString()
  accommodationName?: string;

  /** Type of accommodation */
  @IsOptional()
  @IsIn(['airbnb', 'hotel', 'hostel', 'resort', 'other'])
  accommodationType?: string;

  /** Any additional metadata as a JSON object */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
