//// Controller defines the HTTP routes for the planner.
//// Receives requests and delegates work to PlannerService.
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UrlPlannerRequestDto } from './dto/url-planner-request.dto';
import { TeaserPlannerRequestDto } from './dto/teaser-planner-request.dto';
import { FullPlannerRequestDto } from './dto/full-planner-request.dto';
import { PlannerService } from './planner.service';
import { StandardPlannerResponse } from './types/standard-planner-response';
import { PlannerTeaserResponse } from './types/planner-teaser-response';
import { PlannerFullItineraryResponse } from './types/planner-full-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

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

  //// POST /api/planner/teaser  (public, but links to user if JWT present)
  //// Body: { "tripId": "uuid-string" }
  @UseGuards(OptionalJwtAuthGuard)
  @Post('teaser')
  async generateTeaser(
    @Body() body: TeaserPlannerRequestDto,
    @Req() req: any,
  ): Promise<PlannerTeaserResponse> {
    const userId: string | null = req.user?.id ?? null;
    return this.plannerService.generateTeaser(body.tripId, userId);
  }

  //// POST /api/planner/full  (protected — JWT required)
  //// Body: { "tripId": "uuid-string", "preferences": { ... } }
  @UseGuards(JwtAuthGuard)
  @Post('full')
  async generateFullItinerary(
    @Body() body: FullPlannerRequestDto,
    @Req() req: any,
  ): Promise<PlannerFullItineraryResponse> {
    return this.plannerService.generateFullItinerary(
      body.tripId,
      body.preferences,
      req.user.id,
    );
  }
}
