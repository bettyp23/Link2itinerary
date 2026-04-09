import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Like JwtAuthGuard but does NOT throw 401 for unauthenticated requests.
 * req.user will be the decoded JWT payload if a valid token is present,
 * or null/undefined if there is no token or the token is invalid.
 *
 * Use this on endpoints that are public but can optionally enrich their
 * response/behavior when a user is logged in (e.g. the teaser endpoint —
 * public, but links the result to the user's account when authenticated).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any) {
    // Swallow errors and return null instead of throwing
    return user ?? null;
  }
}
