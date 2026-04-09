import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItineraryCache } from '../itinerary-cache/entities/itinerary-cache.entity';
import { TeaserCache } from '../teaser-cache/entities/teaser-cache.entity';
import { TripSeed } from '../trips/entities/trip-seed.entity';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(ItineraryCache)
    private readonly itineraryCacheRepo: Repository<ItineraryCache>,
    @InjectRepository(TeaserCache)
    private readonly teaserCacheRepo: Repository<TeaserCache>,
    @InjectRepository(TripSeed)
    private readonly tripSeedRepo: Repository<TripSeed>,
  ) {}

  /** List all saved itineraries for the logged-in user, newest first */
  async listSaved(userId: string) {
    const rows = await this.itineraryCacheRepo
      .createQueryBuilder('ic')
      .where('ic.userId = :userId', { userId })
      .andWhere('ic.savedAt IS NOT NULL')
      .orderBy('ic.savedAt', 'DESC')
      .getMany();

    return Promise.all(rows.map((row) => this.buildListItem(row)));
  }

  /** Get one saved itinerary with the full payload and cost estimate */
  async findOne(id: string, userId: string) {
    const row = await this.itineraryCacheRepo.findOne({ where: { id, userId } });
    if (!row) throw new NotFoundException('Itinerary not found');
    const base = await this.buildListItem(row);
    return { ...base, payload: row.payload, costEstimate: row.costEstimate ?? null };
  }

  /** Mark an itinerary as saved (idempotent — safe to call multiple times) */
  async save(id: string, userId: string) {
    const row = await this.itineraryCacheRepo.findOne({ where: { id, userId } });
    if (!row) throw new NotFoundException('Itinerary not found');
    if (!row.savedAt) {
      row.savedAt = new Date();
      await this.itineraryCacheRepo.save(row);
    }
    return { savedAt: row.savedAt };
  }

  /** Build the list-item shape: trip metadata + teaser payload (no full itinerary payload) */
  private async buildListItem(row: ItineraryCache) {
    const [tripSeed, teaserRow] = await Promise.all([
      this.tripSeedRepo.findOne({ where: { id: row.tripSeedId } }),
      this.teaserCacheRepo.findOne({ where: { tripSeedId: row.tripSeedId } }),
    ]);

    return {
      id: row.id,
      tripSeedId: row.tripSeedId,
      savedAt: row.savedAt,
      generatedAt: row.generatedAt,
      preferences: row.preferences,
      tripSeed: tripSeed
        ? {
            location: tripSeed.location ?? null,
            checkIn: tripSeed.checkIn ?? null,
            checkOut: tripSeed.checkOut ?? null,
            accommodationName: tripSeed.accommodationName ?? null,
            accommodationType: tripSeed.accommodationType ?? null,
            summary: tripSeed.summary ?? null,
          }
        : null,
      teaser: teaserRow?.payload ?? null,
    };
  }
}
