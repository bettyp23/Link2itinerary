import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryCache } from '../itinerary-cache/entities/itinerary-cache.entity';
import { TeaserCache } from '../teaser-cache/entities/teaser-cache.entity';
import { TripSeed } from '../trips/entities/trip-seed.entity';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItineraryCache, TeaserCache, TripSeed])],
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
})
export class ItinerariesModule {}
