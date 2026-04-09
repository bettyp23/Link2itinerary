import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

/**
 *   - 1–30 characters
 *   - Only letters, numbers, underscores, periods
 *   - Cannot start or end with a period
 *   - Cannot contain consecutive periods
 */
const USERNAME_REGEX = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Matches(USERNAME_REGEX, {
    message:
      'Username must be 1–30 characters, letters/numbers/periods/underscores only, and cannot start/end with a period or have consecutive periods.',
  })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
