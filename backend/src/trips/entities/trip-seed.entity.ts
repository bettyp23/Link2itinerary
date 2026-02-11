import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * TripSeed entity - represents the initial trip data from a user-provided link.
 *
 * This is the core entity in our system. When a user pastes an Airbnb/hotel link,
 * we create a TripSeed to store all the extracted and user-provided information.
 *
 * Maps to the "trip_seeds" table in the database.
 */
@Entity('trip_seeds')
export class TripSeed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The original link the user pasted (e.g., an Airbnb listing URL) */
  @Column({ type: 'text' })
  url: string;

  /** Optional user-provided summary (e.g., "Weekend getaway to Paris") */
  @Column({ type: 'text', nullable: true })
  summary: string;

  /** Extracted location from the link (e.g., "Paris, France") */
  @Column({ type: 'varchar', length: 255 })
  location: string;

  /** Trip start date */
  @Column({ type: 'date' })
  checkIn: Date;

  /** Trip end date */
  @Column({ type: 'date' })
  checkOut: Date;

  /** Name of the accommodation extracted from the link */
  @Column({ type: 'varchar', length: 255, nullable: true })
  accommodationName: string;

  /** Type of accommodation (e.g., "airbnb", "hotel") */
  @Column({ type: 'varchar', length: 50, nullable: true })
  accommodationType: string;

  /** Flexible JSON field for any additional extracted data */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * Trip status tracks where we are in the workflow:
   * - seed_created: initial state after user submits a link
   * - teaser_generated: quick 3-day overview has been created
   * - itinerary_generated: full detailed itinerary is ready
   */
  @Column({ type: 'varchar', length: 50, default: 'seed_created' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
