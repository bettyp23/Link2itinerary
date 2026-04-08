import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation so DTOs automatically validate incoming requests.
  // whitelist: true  — strips any properties not defined in the DTO (security)
  // transform: true  — auto-converts types (e.g., string "3" → number 3)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Allow the Vite frontend dev server to call this API
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
