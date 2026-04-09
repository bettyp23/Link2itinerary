//// Wires together the PlannerController and PlannerService.
//// Imports TripsModule, TeaserCacheModule, and ItineraryCacheModule so
//// PlannerService can inject the cache repositories to read/write cached results.
import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { TripsModule } from '../trips/trips.module';
import { TeaserCacheModule } from '../teaser-cache/teaser-cache.module';
import { ItineraryCacheModule } from '../itinerary-cache/itinerary-cache.module';
import { EstimatorModule } from '../estimator/estimator.module';

@Module({
  imports: [TripsModule, TeaserCacheModule, ItineraryCacheModule, EstimatorModule],
  controllers: [PlannerController],
  providers: [PlannerService],
})
export class PlannerModule {}
