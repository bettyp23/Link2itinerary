//// Controller defines the HTTP routes for the planner.
//// Receives requests and delegates work to PlannerService.
import { Body, Controller, Post } from '@nestjs/common';
import { UrlPlannerRequestDto } from './dto/url-planner-request.dto';
import { TeaserPlannerRequestDto } from './dto/teaser-planner-request.dto';
import { FullPlannerRequestDto } from './dto/full-planner-request.dto';
import { PlannerService } from './planner.service';
import { StandardPlannerResponse } from './types/standard-planner-response';
import { PlannerTeaserResponse } from './types/planner-teaser-response';
import { PlannerFullItineraryResponse } from './types/planner-full-response';

//// Route prefix: /api/planner
@Controller('api/planner')
export class PlannerController {

  constructor(private readonly plannerService: PlannerService) {}

  //// POST /api/planner/from-url
  //// Body: { "url": "https://..." }
  @Post('from-url')
  async fromUrl(
    @Body() body: UrlPlannerRequestDto,
  ): Promise<StandardPlannerResponse> {
    return this.plannerService.planFromUrl(body.url);
  }

  //// POST /api/planner/teaser
  //// Body: { "tripId": "uuid-string" }
  @Post('teaser')
  async generateTeaser(
    @Body() body: TeaserPlannerRequestDto,
  ): Promise<PlannerTeaserResponse> {
    return this.plannerService.generateTeaser(body.tripId);
  }

  //// POST /api/planner/full
  //// Body: { "tripId": "uuid-string", "preferences": { ... } }
  @Post('full')
  async generateFullItinerary(
    @Body() body: FullPlannerRequestDto,
  ): Promise<PlannerFullItineraryResponse> {
    return this.plannerService.generateFullItinerary(
      body.tripId,
      body.preferences,
    );
  }
}
