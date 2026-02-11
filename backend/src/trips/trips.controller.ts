import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripSeedDto } from './dto/create-trip-seed.dto';
import { UpdateTripSeedDto } from './dto/update-trip-seed.dto';

/**
 * TripsController - handles HTTP requests for trip seed operations.
 *
 * This controller is intentionally "thin" — it only handles:
 * 1. Routing (which URL maps to which method)
 * 2. HTTP concerns (status codes, request parsing)
 * 3. Delegating to TripsService for actual business logic
 *
 * All routes are prefixed with /api/trips (set in @Controller decorator).
 */
@Controller('api/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  /**
   * POST /api/trips/seed
   * Create a new trip seed from a user-provided link.
   *
   * The @Body() decorator extracts the request body and the DTO validates it.
   * If validation fails, NestJS automatically returns 400 Bad Request.
   */
  @Post('seed')
  async create(@Body() createTripSeedDto: CreateTripSeedDto) {
    return this.tripsService.create(createTripSeedDto);
  }

  /**
   * GET /api/trips
   * Retrieve all trip seeds (most recent first).
   */
  @Get()
  async findAll() {
    return this.tripsService.findAll();
  }

  /**
   * GET /api/trips/:id
   * Retrieve a single trip seed by UUID.
   *
   * ParseUUIDPipe validates the ID format — if someone sends a non-UUID string,
   * it returns 400 Bad Request instead of hitting the database.
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.findOne(id);
  }

  /**
   * PATCH /api/trips/:id
   * Update an existing trip seed (partial updates allowed).
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTripSeedDto: UpdateTripSeedDto,
  ) {
    return this.tripsService.update(id, updateTripSeedDto);
  }

  /**
   * DELETE /api/trips/:id
   * Delete a trip seed.
   *
   * Returns 204 No Content on success (standard for DELETE operations).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.remove(id);
  }
}
