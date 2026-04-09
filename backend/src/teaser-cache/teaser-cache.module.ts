import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeaserCache } from './entities/teaser-cache.entity';

/**
 * TeaserCacheModule — registers the TeaserCache entity so TypeORM
 * creates the "teaser_cache" table.
 * Service/logic for reading and writing the cache will be added here.
 */
@Module({
  imports: [TypeOrmModule.forFeature([TeaserCache])],
  exports: [TypeOrmModule],
})
export class TeaserCacheModule {}
