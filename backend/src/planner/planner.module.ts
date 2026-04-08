//// Wires together the PlannerController and PlannerService.
//// Imports TripsModule so PlannerService can inject TripsService to look up trips by ID.
import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';
import { TripsModule } from '../trips/trips.module';

@Module({
  //// Import TripsModule to make TripsService available for injection
  imports: [TripsModule],

  //// Registers the controller that handles HTTP requests
  controllers: [PlannerController],

  //// Registers the service that contains the business logic
  providers: [PlannerService],
})
export class PlannerModule {}
