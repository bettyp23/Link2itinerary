import { createHash } from 'crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import { newUuid } from '../common/ids';
import { StandardPlannerResponse } from './types/standard-planner-response';
import { PlannerTeaserResponse } from './types/planner-teaser-response';
import { PlannerFullItineraryResponse } from './types/planner-full-response';
import { TripsService } from '../trips/trips.service';
import { TeaserCache } from '../teaser-cache/entities/teaser-cache.entity';
import { ItineraryCache } from '../itinerary-cache/entities/itinerary-cache.entity';
import { EstimatorService } from '../estimator/estimator.service';

@Injectable()
export class PlannerService {
  constructor(
    private readonly tripsService: TripsService,
    private readonly estimatorService: EstimatorService,
    @InjectRepository(TeaserCache)
    private readonly teaserCacheRepo: Repository<TeaserCache>,
    @InjectRepository(ItineraryCache)
    private readonly itineraryCacheRepo: Repository<ItineraryCache>,
  ) {}

  //// OpenAI client initialization
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /** Claim the teaser_cache row for a user if it was generated anonymously */
  private async claimTeaserForUser(tripId: string, userId: string): Promise<void> {
    const teaser = await this.teaserCacheRepo.findOne({ where: { tripSeedId: tripId } });
    if (teaser && !teaser.userId) {
      teaser.userId = userId;
      await this.teaserCacheRepo.save(teaser);
    }
  }

  /**
   * Hash a preferences object into a short hex string for use as a cache key.
   * Sorting keys first ensures { budget: 'moderate', pace: 'relaxed' } and
   * { pace: 'relaxed', budget: 'moderate' } produce the same hash.
   */
  private hashPreferences(preferences: Record<string, any>): string {
    const sorted = JSON.stringify(preferences, Object.keys(preferences).sort());
    return createHash('sha256').update(sorted).digest('hex');
  }

  //// Main service function (from-url, legacy endpoint)
  async planFromUrl(url: string): Promise<StandardPlannerResponse> {
    if (!process.env.OPENAI_API_KEY) {
      throw new BadRequestException('Missing OPENAI_API_KEY in backend/.env');
    }

    const html = await this.fetchHtml(url);
    const extracted = this.extractText(html);
    const clipped =
      extracted.length > 8000
        ? extracted.slice(0, 8000) + ' …[clipped]'
        : extracted;

    const itineraryId = newUuid();
    const tripId = `trip-${newUuid()}`;

    const schema = {
      name: 'standard_planner_response',
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          itinerary: {
            type: 'object',
            additionalProperties: false,
            properties: {
              id: { type: 'string' },
              tripId: { type: 'string' },
              days: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    date: { type: 'string' },
                    activities: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          time: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
                          duration: { type: 'integer', minimum: 15, maximum: 480 },
                          title: { type: 'string' },
                          description: { type: 'string' },
                          location: { type: 'string' },
                          estimatedCost: { type: 'integer', minimum: 0, maximum: 1000 },
                          bookingUrl: { type: 'string' },
                        },
                        required: ['time', 'duration', 'title', 'description', 'location', 'estimatedCost', 'bookingUrl'],
                      },
                    },
                  },
                  required: ['date', 'activities'],
                },
              },
              totalEstimatedCost: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  min: { type: 'integer', minimum: 0 },
                  max: { type: 'integer', minimum: 0 },
                  currency: { type: 'string', enum: ['USD'] },
                },
                required: ['min', 'max', 'currency'],
              },
            },
            required: ['id', 'tripId', 'days', 'totalEstimatedCost'],
          },
        },
        required: ['itinerary'],
      },
    };

    try {
      const resp = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'standard_planner_response', strict: true, schema: schema.schema },
        },
        messages: [
          { role: 'system', content: 'You are a travel itinerary planner. Return JSON matching the schema exactly.' },
          {
            role: 'user',
            content: [
              `SOURCE URL: ${url}`, ``,
              `Use these fixed IDs:`,
              `itinerary.id = ${itineraryId}`,
              `itinerary.tripId = ${tripId}`, ``,
              `Extracted page text:`, clipped, ``,
              `Rules (TEASER MODE):`,
              `- EXACTLY 2 activities per day.`,
              `- Titles max 6 words.`,
              `- Descriptions max 20 words.`,
              `- Duration must be integer minutes.`,
              `- EstimatedCost must be integer.`,
              `- bookingUrl must be "" if unknown.`,
              `- totalEstimatedCost must be 0/0/USD unless confident.`,
            ].join('\n'),
          },
        ],
      });

      const outputText = resp.choices[0]?.message?.content ?? '';
      return JSON.parse(outputText) as StandardPlannerResponse;
    } catch (err: any) {
      console.log('OpenAI error, returning fallback:', err?.message);
      return {
        itinerary: {
          id: itineraryId,
          tripId,
          days: [{
            date: new Date().toISOString().slice(0, 10),
            activities: [
              { time: '10:00', duration: 60, title: 'Sample teaser activity', description: 'Fallback itinerary while API unavailable.', location: 'Unknown', estimatedCost: 0, bookingUrl: '' },
              { time: '14:00', duration: 60, title: 'Second sample stop', description: 'Error when generating itinerary.', location: 'Unknown', estimatedCost: 0, bookingUrl: '' },
            ],
          }],
          totalEstimatedCost: { min: 0, max: 0, currency: 'USD' },
        },
      };
    }
  }

  //// Fetch webpage HTML
  private async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Link2Itinerary MVP)' } });
    if (!res.ok) throw new BadRequestException(`Failed to fetch URL (${res.status})`);
    return await res.text();
  }

  //// Extract readable text from HTML using Cheerio
  private extractText(html: string): string {
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, noscript, iframe').remove();
    const text = $('main').text().trim() || $('article').text().trim() || $('body').text().trim();
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Generate (or return cached) 3-day teaser itinerary for a trip.
   *
   * Cache flow:
   *   1. Check teaser_cache for an existing row with this tripSeedId
   *   2. If found → return the stored payload immediately (no OpenAI call)
   *   3. If not found → call OpenAI, then upsert the result into teaser_cache
   */
  async generateTeaser(tripId: string, userId?: string | null): Promise<PlannerTeaserResponse> {
    if (!process.env.OPENAI_API_KEY) {
      throw new BadRequestException('Missing OPENAI_API_KEY in backend/.env');
    }

    const trip = await this.tripsService.findOne(tripId);
    if (!trip) throw new NotFoundException(`Trip with ID "${tripId}" not found`);

    // ── Cache read ──────────────────────────────────────────────────────────
    const cached = await this.teaserCacheRepo.findOne({ where: { tripSeedId: tripId } });
    if (cached) {
      console.log(`Teaser cache hit for trip ${tripId}`);
      return cached.payload as PlannerTeaserResponse;
    }
    console.log(`Teaser cache miss for trip ${tripId} — calling OpenAI`);
    // ────────────────────────────────────────────────────────────────────────

    let content = trip.summary || '';
    if (trip.url) {
      try {
        const html = await this.fetchHtml(trip.url);
        const extracted = this.extractText(html);
        content = extracted.length > 4000 ? extracted.slice(0, 4000) + ' …[clipped]' : extracted;
      } catch (err) {
        console.log('Failed to fetch URL, using summary:', err);
      }
    }

    const itineraryId = newUuid();

    const checkIn = trip.checkIn
      ? (trip.checkIn instanceof Date ? trip.checkIn.toISOString().slice(0, 10) : String(trip.checkIn))
      : new Date().toISOString().slice(0, 10);

    const checkOut = trip.checkOut
      ? (trip.checkOut instanceof Date ? trip.checkOut.toISOString().slice(0, 10) : String(trip.checkOut))
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const daysDiff = Math.max(3, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const teaserDays = Math.min(3, daysDiff);

    const teaserDates: string[] = [];
    for (let i = 0; i < teaserDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      teaserDates.push(date.toISOString().slice(0, 10));
    }

    const schema = {
      name: 'planner_teaser_response',
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          days: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                date: { type: 'string' },
                theme: { type: 'string' },
                highlights: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 5 },
              },
              required: ['date', 'theme', 'highlights'],
            },
            minItems: teaserDays,
            maxItems: teaserDays,
          },
          estimatedCost: {
            type: 'object',
            additionalProperties: false,
            properties: {
              min: { type: 'integer', minimum: 0 },
              max: { type: 'integer', minimum: 0 },
              currency: { type: 'string', enum: ['USD'] },
            },
            required: ['min', 'max', 'currency'],
          },
          vibeTags: { type: 'array', items: { type: 'string' } },
          bestTimeToGo: { type: 'string' },
        },
        required: ['days', 'estimatedCost', 'vibeTags', 'bestTimeToGo'],
      },
    };

    try {
      const resp = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'planner_teaser_response', strict: true, schema: schema.schema },
        },
        messages: [
          { role: 'system', content: 'You are a travel itinerary planner. Generate a 3-day teaser itinerary with themes and highlights. Return JSON matching the schema exactly.' },
          {
            role: 'user',
            content: [
              `TRIP DETAILS:`,
              `Location: ${trip.location || 'Not specified'}`,
              `Check-in: ${checkIn}`,
              `Check-out: ${checkOut}`,
              `Accommodation: ${trip.accommodationName || 'Not specified'}`,
              `Summary: ${trip.summary || 'No summary provided'}`, ``,
              `CONTENT FROM LINK:`, content, ``,
              `GENERATE TEASER ITINERARY:`,
              `- Create exactly ${teaserDays} days`,
              `- Dates: ${teaserDates.join(', ')}`,
              `- Each day needs:`,
              `  * A theme (e.g., "Arrival & Local Exploration", "Museums & Culture")`,
              `  * 3-5 highlights (short phrases, max 8 words each)`,
              `- Provide estimated cost range for the entire trip in USD`,
              `- Suggest 3-5 vibe tags (e.g., ["relaxed", "cultural", "foodie"])`,
              `- Suggest best time to go (short phrase)`,
            ].join('\n'),
          },
        ],
      });

      const outputText = resp.choices[0]?.message?.content ?? '';
      const parsed = JSON.parse(outputText);

      const result: PlannerTeaserResponse = {
        id: itineraryId,
        tripId: trip.id,
        type: 'teaser',
        days: parsed.days.map((day: any, index: number) => ({
          date: teaserDates[index] || day.date,
          theme: day.theme,
          highlights: day.highlights,
        })),
        estimatedCost: parsed.estimatedCost,
        generatedAt: new Date().toISOString(),
        vibeTags: parsed.vibeTags,
        bestTimeToGo: parsed.bestTimeToGo,
      };

      // ── Cache write (upsert) ──────────────────────────────────────────────
      await this.teaserCacheRepo.upsert(
        {
          tripSeedId: trip.id,
          payload: result as unknown as Record<string, any>,
          userId: userId ?? null,
          generatedAt: new Date(),
        },
        { conflictPaths: ['tripSeedId'] },
      );
      // ─────────────────────────────────────────────────────────────────────

      // Claim the trip seed for this user if it was created anonymously
      if (userId) {
        await this.tripsService.claimForUser(trip.id, userId);
      }

      await this.tripsService.update(trip.id, { status: 'teaser_generated' });

      return result;
    } catch (err: any) {
      console.log('OpenAI error, returning fallback teaser:', err?.message);
      return {
        id: itineraryId,
        tripId: trip.id,
        type: 'teaser',
        days: teaserDates.map((date) => ({
          date,
          theme: 'Sample Day',
          highlights: ['Sample activity', 'Another activity', 'Final activity'],
        })),
        estimatedCost: { min: 0, max: 0, currency: 'USD' },
        generatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate (or return cached) full itinerary for a trip + preferences combo.
   *
   * Cache flow:
   *   1. Hash the preferences object to a short key
   *   2. Check itinerary_cache for (tripSeedId, preferencesHash)
   *   3. If found → return the stored payload immediately (no OpenAI call)
   *   4. If not found → call OpenAI, then insert the result into itinerary_cache
   */
  async generateFullItinerary(
    tripId: string,
    preferences: {
      interests?: string[];
      budget?: 'budget' | 'moderate' | 'luxury';
      pace?: 'relaxed' | 'moderate' | 'packed';
      dietary?: string[];
      accessibility?: string[];
    },
    userId: string,
  ): Promise<PlannerFullItineraryResponse> {
    if (!process.env.OPENAI_API_KEY) {
      throw new BadRequestException('Missing OPENAI_API_KEY in backend/.env');
    }

    const trip = await this.tripsService.findOne(tripId);
    if (!trip) throw new NotFoundException(`Trip with ID "${tripId}" not found`);

    // ── Cache read ──────────────────────────────────────────────────────────
    const preferencesHash = this.hashPreferences(preferences);
    const cached = await this.itineraryCacheRepo.findOne({
      where: { tripSeedId: tripId, preferencesHash },
    });
    if (cached) {
      console.log(`Itinerary cache hit for trip ${tripId} / hash ${preferencesHash}`);
      // Claim any unclaimed records now that we know who the user is
      await this.tripsService.claimForUser(tripId, userId);
      await this.claimTeaserForUser(tripId, userId);
      if (!cached.userId) {
        cached.userId = userId;
        await this.itineraryCacheRepo.save(cached);
      }
      return cached.payload as PlannerFullItineraryResponse;
    }
    console.log(`Itinerary cache miss for trip ${tripId} — calling OpenAI`);
    // ────────────────────────────────────────────────────────────────────────

    // Claim the seed and teaser for this user before generating
    await this.tripsService.claimForUser(tripId, userId);
    await this.claimTeaserForUser(tripId, userId);

    let content = trip.summary || '';
    if (trip.url) {
      try {
        const html = await this.fetchHtml(trip.url);
        const extracted = this.extractText(html);
        content = extracted.length > 6000 ? extracted.slice(0, 6000) + ' …[clipped]' : extracted;
      } catch (err) {
        console.log('Failed to fetch URL, using summary:', err);
      }
    }

    const itineraryId = newUuid();

    const checkIn = trip.checkIn
      ? (trip.checkIn instanceof Date ? trip.checkIn.toISOString().slice(0, 10) : String(trip.checkIn))
      : new Date().toISOString().slice(0, 10);

    const checkOut = trip.checkOut
      ? (trip.checkOut instanceof Date ? trip.checkOut.toISOString().slice(0, 10) : String(trip.checkOut))
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const tripDays: string[] = [];
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      tripDays.push(date.toISOString().slice(0, 10));
    }

    const activitiesPerDay = { relaxed: 2, moderate: 3, packed: 5 }[preferences.pace || 'moderate'] || 3;

    const schema = {
      name: 'planner_full_response',
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          days: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                date: { type: 'string' },
                activities: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      id: { type: 'string' },
                      time: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
                      duration: { type: 'integer', minimum: 15, maximum: 480 },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      location: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          name: { type: 'string' },
                          address: { type: 'string' },
                          coordinates: {
                            type: 'object',
                            additionalProperties: false,
                            properties: { lat: { type: 'number' }, lng: { type: 'number' } },
                            required: ['lat', 'lng'],
                          },
                        },
                        required: ['name', 'address', 'coordinates'],
                      },
                      category: { type: 'string' },
                      estimatedCost: { type: 'integer', minimum: 0 },
                      bookingUrl: { type: 'string' },
                      tips: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['id', 'time', 'duration', 'title', 'description', 'location', 'category', 'estimatedCost', 'bookingUrl', 'tips'],
                  },
                  minItems: activitiesPerDay - 1,
                  maxItems: activitiesPerDay + 1,
                },
              },
              required: ['date', 'activities'],
            },
            minItems: tripDays.length,
            maxItems: tripDays.length,
          },
          totalEstimatedCost: {
            type: 'object',
            additionalProperties: false,
            properties: {
              min: { type: 'integer', minimum: 0 },
              max: { type: 'integer', minimum: 0 },
              currency: { type: 'string', enum: ['USD'] },
              breakdown: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  dining: { type: 'integer', minimum: 0 },
                  activities: { type: 'integer', minimum: 0 },
                  transportation: { type: 'integer', minimum: 0 },
                  shopping: { type: 'integer', minimum: 0 },
                  miscellaneous: { type: 'integer', minimum: 0 },
                },
                required: ['dining', 'activities', 'transportation', 'shopping', 'miscellaneous'],
              },
            },
            required: ['min', 'max', 'currency', 'breakdown'],
          },
        },
        required: ['days', 'totalEstimatedCost'],
      },
    };

    try {
      const preferencesText = [
        preferences.interests?.length ? `Interests: ${preferences.interests.join(', ')}` : '',
        preferences.budget ? `Budget: ${preferences.budget}` : '',
        preferences.pace ? `Pace: ${preferences.pace}` : '',
        preferences.dietary?.length ? `Dietary: ${preferences.dietary.join(', ')}` : '',
        preferences.accessibility?.length ? `Accessibility: ${preferences.accessibility.join(', ')}` : '',
      ].filter(Boolean).join('\n');

      const resp = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'planner_full_response', strict: true, schema: schema.schema },
        },
        messages: [
          { role: 'system', content: 'You are a travel itinerary planner. Generate a detailed day-by-day itinerary with specific activities, times, and locations. Return JSON matching the schema exactly.' },
          {
            role: 'user',
            content: [
              `TRIP DETAILS:`,
              `Location: ${trip.location || 'Not specified'}`,
              `Check-in: ${checkIn}`,
              `Check-out: ${checkOut}`,
              `Accommodation: ${trip.accommodationName || 'Not specified'}`,
              `Summary: ${trip.summary || 'No summary provided'}`, ``,
              `USER PREFERENCES:`,
              preferencesText || 'No specific preferences', ``,
              `CONTENT FROM LINK:`, content, ``,
              `GENERATE FULL ITINERARY:`,
              `- Create itinerary for ${tripDays.length} days (${tripDays.join(', ')})`,
              `- ${activitiesPerDay} activities per day (pace: ${preferences.pace || 'moderate'})`,
              `- Each activity needs: id, time (HH:MM), duration (minutes), title, description,`,
              `  location (name + address + coordinates), category, estimatedCost (integer), bookingUrl ("" if none), tips array`,
              `- Account for realistic travel time between locations`,
              `- Respect dietary and accessibility requirements`,
              `- Provide total cost estimate with breakdown by category (dining, activities, transportation, shopping, miscellaneous)`,
            ].join('\n'),
          },
        ],
      });

      const outputText = resp.choices[0]?.message?.content ?? '';
      const parsed = JSON.parse(outputText);

      let totalActivities = 0;
      parsed.days.forEach((day: any) => { totalActivities += day.activities?.length || 0; });

      const result: PlannerFullItineraryResponse = {
        id: itineraryId,
        tripId: trip.id,
        type: 'full',
        days: parsed.days.map((day: any, index: number) => ({
          date: tripDays[index] || day.date,
          activities: day.activities.map((activity: any) => ({
            id: activity.id || `activity-${newUuid()}`,
            time: activity.time,
            duration: activity.duration,
            title: activity.title,
            description: activity.description || undefined,
            location: activity.location || undefined,
            category: activity.category || undefined,
            estimatedCost: activity.estimatedCost || 0,
            bookingUrl: activity.bookingUrl || null,
            tips: activity.tips || undefined,
          })),
          dailyTotal: day.activities?.reduce((sum: number, a: any) => sum + (a.estimatedCost || 0), 0) || 0,
        })),
        totalEstimatedCost: parsed.totalEstimatedCost,
        metadata: { totalActivities, totalDays: tripDays.length, preferences },
        generatedAt: new Date().toISOString(),
      };

      // ── Cache write ───────────────────────────────────────────────────────
      // Use result.id as the PK so the frontend can reference this row directly
      await this.itineraryCacheRepo.save({
        id: itineraryId,
        tripSeedId: trip.id,
        preferencesHash,
        preferences: preferences as unknown as Record<string, any>,
        payload: result as unknown as Record<string, any>,
        userId,
        savedAt: null,
        generatedAt: new Date(),
      });

      // Calculate and persist the cost estimate so saved itineraries always
      // display the same numbers without re-running the estimator later
      const costEstimate = await this.estimatorService.calculate({ itineraryId });
      await this.itineraryCacheRepo.update(
        { id: itineraryId },
        { costEstimate: costEstimate as unknown as Record<string, any> },
      );
      // ─────────────────────────────────────────────────────────────────────

      await this.tripsService.update(trip.id, { status: 'itinerary_generated' });

      return result;
    } catch (err: any) {
      console.log('OpenAI error, returning fallback full itinerary:', err?.message);
      return {
        id: itineraryId,
        tripId: trip.id,
        type: 'full',
        days: tripDays.map((date) => ({
          date,
          activities: [{
            id: `activity-${newUuid()}`,
            time: '10:00',
            duration: 60,
            title: 'Sample Activity',
            description: 'Fallback activity while API unavailable.',
            location: { name: 'Unknown Location' },
            estimatedCost: 0,
          }],
          dailyTotal: 0,
        })),
        totalEstimatedCost: { min: 0, max: 0, currency: 'USD' },
        metadata: { totalActivities: tripDays.length, totalDays: tripDays.length, preferences },
        generatedAt: new Date().toISOString(),
      };
    }
  }
}
