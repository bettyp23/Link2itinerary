import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TripSeed } from '../../trips/entities/trip-seed.entity';

/**
 * ItineraryCache entity — maps to the "itinerary_cache" table.
 *
 * Stores generated full itineraries keyed by trip seed + preferences.
 * Because the full itinerary changes based on the user's preferences
 * (budget, pace, interests, etc.), each unique combination of
 * trip seed + preferences gets its own cached row.
 *
 * preferencesHash is a SHA-256 of the serialized preferences object.
 * This lets us look up "have we already generated this exact itinerary
 * before?" in a single indexed query without storing the full preferences
 * in the key.
 *
 * The UNIQUE constraint on (trip_seed_id, preferences_hash) ensures we
 * never store duplicate results for the same trip + preferences combo.
 */
@Entity('itinerary_cache')
@Index(['tripSeedId', 'preferencesHash'], { unique: true })
export class ItineraryCache {
  /** Explicitly set to match result.id from the planner service so the frontend
   *  can reference this row by the itinerary ID it already has. */
  @PrimaryColumn('uuid')
  id: string;

  /** The trip seed this itinerary belongs to */
  @ManyToOne(() => TripSeed, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_seed_id' })
  tripSeed: TripSeed;

  @Column({ type: 'uuid' })
  tripSeedId: string;

  /**
   * SHA-256 hash of the JSON-serialized preferences object.
   * Used as a cache key alongside tripSeedId.
   * e.g. hash({ interests: ["food"], budget: "moderate", pace: "relaxed", ... })
   */
  @Column({ type: 'varchar', length: 64 })
  preferencesHash: string;

  /**
   * The preferences that produced this itinerary, stored for reference.
   * Shape: { interests, budget, pace, dietary, accessibility }
   */
  @Column({ type: 'jsonb' })
  preferences: Record<string, any>;

  /**
   * Full itinerary response stored as JSONB.
   * Shape: PlannerFullItineraryResponse (days, totalEstimatedCost, metadata, etc.)
   */
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  /**
   * Cost estimate calculated by EstimatorService at generation time.
   * Stored here so saved itineraries always show the same numbers
   * without re-running the estimator.
   * Shape: CostEstimateResponse
   */
  @Column({ type: 'jsonb', nullable: true })
  costEstimate: Record<string, any> | null;

  /** The user who owns this itinerary — set when the JWT-authenticated planner endpoint is called */
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  /** Set when the user explicitly clicks "Add to my itineraries". Null means not saved yet. */
  @Column({ type: 'timestamp with time zone', nullable: true })
  savedAt: Date | null;

  /** When OpenAI generated this itinerary */
  @Column({ type: 'timestamp with time zone', nullable: true })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
