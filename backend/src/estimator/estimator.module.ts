import { Module } from '@nestjs/common';
import { EstimatorController } from './estimator.controller';
import { EstimatorService } from './estimator.service';

@Module({
  controllers: [EstimatorController],
  providers: [EstimatorService],
})
export class EstimatorModule {}
