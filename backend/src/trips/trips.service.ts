import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripSeed } from './entities/trip-seed.entity';
import { CreateTripSeedDto } from './dto/create-trip-seed.dto';
import { UpdateTripSeedDto } from './dto/update-trip-seed.dto';

/**
 * TripsService handles all business logic for trip seeds.
 *
 * Why a separate service instead of putting logic in the controller?
 * - Testability: we can test business logic without HTTP
 * - Reusability: other modules (Planner, Estimator) can inject this service
 * - Separation of concerns: controller handles HTTP, service handles logic
 */
@Injectable()
export class TripsService {
  constructor(
    // TypeORM injects the repository for TripSeed entity
    // Think of a repository as a "gateway" to the trip_seeds table
    @InjectRepository(TripSeed)
    private readonly tripSeedRepository: Repository<TripSeed>,
  ) {}

  /**
   * Create a new trip seed from user input.
   * Takes validated DTO data and persists it to the database.
   */
  async create(createTripSeedDto: CreateTripSeedDto): Promise<TripSeed> {
    // .create() builds the entity object (in memory, not saved yet)
    const tripSeed = this.tripSeedRepository.create(createTripSeedDto);

    // .save() actually writes to the database and returns the saved entity with its generated ID
    return this.tripSeedRepository.save(tripSeed);
  }

  /**
   * Retrieve all trip seeds.
   * Ordered by most recent first.
   */
  async findAll(): Promise<TripSeed[]> {
    return this.tripSeedRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a single trip seed by its UUID.
   * Throws a 404 if the trip doesn't exist.
   */
  async findOne(id: string): Promise<TripSeed> {
    const tripSeed = await this.tripSeedRepository.findOne({
      where: { id },
    });

    if (!tripSeed) {
      throw new NotFoundException(`Trip seed with ID "${id}" not found`);
    }

    return tripSeed;
  }

  /**
   * Update an existing trip seed.
   * Only updates the fields that are provided in the DTO.
   */
  async update(
    id: string,
    updateTripSeedDto: UpdateTripSeedDto,
  ): Promise<TripSeed> {
    // First check that the trip exists (throws 404 if not)
    const tripSeed = await this.findOne(id);

    // Merge the updates into the existing entity
    // Object.assign copies only the provided fields onto the existing object
    Object.assign(tripSeed, updateTripSeedDto);

    return this.tripSeedRepository.save(tripSeed);
  }

  /**
   * Delete a trip seed by its UUID.
   * Throws a 404 if the trip doesn't exist.
   */
  async remove(id: string): Promise<void> {
    // Verify it exists first (throws 404 if not)
    await this.findOne(id);

    await this.tripSeedRepository.delete(id);
  }
}
