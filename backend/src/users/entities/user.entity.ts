import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * User entity — maps to the "users" table.
 *
 * Stores account credentials for authentication.
 * passwordHash stores a bcrypt hash — the plaintext password is never saved.
 *
 * Username follows Instagram rules:
 *   - 1–30 characters
 *   - Only letters, numbers, periods, underscores
 *   - Cannot start or end with a period
 *   - Cannot contain consecutive periods
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Unique username — used as the login identifier */
  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  /** bcrypt hash of the user's password — never store plaintext */
  @Column({ type: 'text' })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
