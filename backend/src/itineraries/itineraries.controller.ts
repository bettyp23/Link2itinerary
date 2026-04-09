import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/itineraries')
@UseGuards(JwtAuthGuard)
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  /** GET /api/itineraries — list all saved itineraries for the current user */
  @Get()
  list(@Req() req: any) {
    return this.itinerariesService.listSaved(req.user.id);
  }

  /** GET /api/itineraries/:id — full detail for one saved itinerary */
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.itinerariesService.findOne(id, req.user.id);
  }

  /** POST /api/itineraries/:id/save — mark an itinerary as saved */
  @Post(':id/save')
  save(@Param('id') id: string, @Req() req: any) {
    return this.itinerariesService.save(id, req.user.id);
  }
}
