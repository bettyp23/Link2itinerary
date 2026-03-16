import { IsString, IsUUID, IsObject, IsOptional, IsArray, IsIn } from 'class-validator';

/**
 * Preferences type matching frontend
 */
export class PreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsIn(['budget', 'moderate', 'luxury'])
  budget?: 'budget' | 'moderate' | 'luxury';

  @IsOptional()
  @IsIn(['relaxed', 'moderate', 'packed'])
  pace?: 'relaxed' | 'moderate' | 'packed';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietary?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibility?: string[];
}

/**
 * DTO for POST /api/planner/full
 * Request body: { "tripId": "uuid-string", "preferences": { ... } }
 */
export class FullPlannerRequestDto {
  @IsString()
  @IsUUID()
  tripId!: string;

  @IsObject()
  preferences!: PreferencesDto;
}
