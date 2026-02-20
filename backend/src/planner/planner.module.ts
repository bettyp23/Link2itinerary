//// Wires together the PlannerController and PlannerService so NestJS can inject dependencies properly.
import { Module } from '@nestjs/common';
import { PlannerController } from './planner.controller';
import { PlannerService } from './planner.service';

@Module({
  //// Registers the controller that handles HTTP requests.
  controllers: [PlannerController],

  //// Registers the service that contains the business logic.
  providers: [PlannerService],
})
export class PlannerModule {}

