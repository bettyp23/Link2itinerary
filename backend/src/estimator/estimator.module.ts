import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimatorController } from './estimator.controller';
import { EstimatorService } from './estimator.service';
import { ItineraryCache } from '../itinerary-cache/entities/itinerary-cache.entity';
import { TripSeed } from '../trips/entities/trip-seed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItineraryCache, TripSeed])],
  controllers: [EstimatorController],
  providers: [EstimatorService],
  exports: [EstimatorService],
})
export class EstimatorModule {}
