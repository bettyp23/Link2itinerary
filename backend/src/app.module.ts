import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';
import { PlannerModule } from './planner/planner.module';
import { EstimatorModule } from './estimator/estimator.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { TeaserCacheModule } from './teaser-cache/teaser-cache.module';
import { ItineraryCacheModule } from './itinerary-cache/itinerary-cache.module';

@Module({
  imports: [
    // Load .env file so we can use process.env throughout the app
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connect to Supabase PostgreSQL using the DATABASE_URL from .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // Automatically picks up entities registered in modules
      synchronize: true, // Auto-creates tables from entities (disable in production!)
      // Keep connections alive so Supabase doesn't drop idle sockets mid-request
      extra: {
        max: 5,                          // small pool — fine for dev
        keepAlive: true,                 // send TCP keep-alive pings
        keepAliveInitialDelayMillis: 10000,
        idleTimeoutMillis: 30000,        // remove idle connections after 30 s
        connectionTimeoutMillis: 5000,   // fail fast if Supabase is unreachable
      },
    }),

    // Feature modules
    TripsModule,
    PlannerModule,
    EstimatorModule,
    UsersModule,
    AuthModule,
    ItinerariesModule,
    TeaserCacheModule,
    ItineraryCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
