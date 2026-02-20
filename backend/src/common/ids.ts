////IDs file until it is associated with database
import { randomUUID } from 'crypto';

//// Generates a random UUID using Node's built-in crypto module.
//// Ensures every itinerary response has a unique ID.
export function newUuid(): string {
  return randomUUID();
}

