//// This DTO defines the request body structure
//// for POST /api/planner/from-url
//// It validates that the client sends a proper URL.

import { IsString, IsUrl } from 'class-validator';

//// The request must contain:
//// {
////   "url": "https://example.com/article"
//// }
export class UrlPlannerRequestDto {

  //// Ensures the value exists and is a string
  @IsString()

  //// Ensures it is a valid URL including protocol (http or https)
  @IsUrl({ require_protocol: true })
  url!: string;
}

