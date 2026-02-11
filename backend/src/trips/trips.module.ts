import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripSeed } from './entities/trip-seed.entity';

/**
 * TripsModule bundles together everything related to trip seeds.
 *
 * How NestJS modules work (restaurant analogy):
 * - The module is like a "department" in a restaurant (e.g., the kitchen)
 * - imports: supplies the department needs (database access for TripSeed)
 * - controllers: the waiters who take orders (handle HTTP requests)
 * - providers: the chefs who do the actual work (business logic services)
 * - exports: dishes that other departments can order (services other modules can use)
 *
 * We export TripsService so that the Planner module can inject it later
 * to look up trip data when generating itineraries.
 */
@Module({
  imports: [
    // Register the TripSeed entity with TypeORM for this module
    // This lets us inject Repository<TripSeed> in our service
    TypeOrmModule.forFeature([TripSeed]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService], // Other modules (Planner, Estimator) can use TripsService
})
export class TripsModule {}
