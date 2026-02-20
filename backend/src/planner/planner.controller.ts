//// Controller defines the HTTP route
//// Receives the request and delegates work to PlannerService
import { Body, Controller, Post } from '@nestjs/common';
import { UrlPlannerRequestDto } from './dto/url-planner-request.dto';
import { PlannerService } from './planner.service';
import { StandardPlannerResponse } from './types/standard-planner-response';

//// Route prefix becomes:
//// /api/planner
@Controller('api/planner')
export class PlannerController {

  //// Insert PlannerService via constructor
  constructor(private readonly plannerService: PlannerService) {}

  //// POST /api/planner/from-url
  //// Body: { "url": "https://..." }
  @Post('from-url')
  async fromUrl(
    @Body() body: UrlPlannerRequestDto,
  ): Promise<StandardPlannerResponse> {

    //// Delegates logic to the service layer.
    return this.plannerService.planFromUrl(body.url);
  }
}

