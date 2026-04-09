import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { TripSeed } from '../../trips/entities/trip-seed.entity';

/**
 * TeaserCache entity — maps to the "teaser_cache" table.
 *
 * Stores the generated teaser itinerary for a trip seed so we don't
 * have to call OpenAI again on repeat visits.
 *
 * One teaser per trip seed (1:1). If the teaser is regenerated, the
 * existing row is overwritten (upsert) rather than duplicated.
 *
 * payload stores the full PlannerTeaserResponse JSON exactly as returned
 * by the planner service — no need to normalize into separate rows.
 */
@Entity('teaser_cache')
export class TeaserCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The trip seed this teaser belongs to.
   * UNIQUE enforces the one-teaser-per-seed rule at the DB level.
   */
  @OneToOne(() => TripSeed, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_seed_id' })
  tripSeed: TripSeed;

  @Column({ type: 'uuid', unique: true })
  tripSeedId: string;

  /**
   * Full teaser response stored as JSONB.
   * Shape: PlannerTeaserResponse (days, estimatedCost, vibeTags, etc.)
   */
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  /** The user who owns this teaser — null if generated anonymously */
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  /** When OpenAI generated this teaser */
  @Column({ type: 'timestamp with time zone', nullable: true })
  generatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
