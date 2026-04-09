import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryCache } from './entities/itinerary-cache.entity';

/**
 * ItineraryCacheModule — registers the ItineraryCache entity so TypeORM
 * creates the "itinerary_cache" table.
 * Service/logic for reading and writing the cache will be added here.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ItineraryCache])],
  exports: [TypeOrmModule],
})
export class ItineraryCacheModule {}
