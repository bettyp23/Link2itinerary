import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';

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
    }),

    // Feature modules
    TripsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
