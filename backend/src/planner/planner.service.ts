import { BadRequestException, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import { newUuid } from '../common/ids';
import { StandardPlannerResponse } from './types/standard-planner-response';

@Injectable()
export class PlannerService {

  //// OpenAI client initialization
  //// This creates a reusable OpenAI client instance using the API key
  //// stored in your backend .env file.
  //// Every request to the AI will go through this client.
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  //// Main service function
  //// - Fetches the webpage
  //// - Extracts readable text
  //// - Sends structured instructions + content to OpenAI
  //// - Forces the response to match a strict JSON schema
  //// - Returns a fully structured itinerary object
  async planFromUrl(url: string): Promise<StandardPlannerResponse> {

    //// Safety check to make sure API key exists
    //// If missing, stops immediately
    if (!process.env.OPENAI_API_KEY) {
      throw new BadRequestException('Missing OPENAI_API_KEY in backend/.env');
    }

    //// Fetch raw HTML from the provided URL
    const html = await this.fetchHtml(url);

    //// Extract readable content from HTML without the strips scripts, navigation, and unnecessary layout elements
    const extracted = this.extractText(html);

    //// Limit the amount of content sent to OpenAI
    const clipped =
      extracted.length > 8000
        ? extracted.slice(0, 8000) + ' …[clipped]'
        : extracted;

    //// Generate unique IDs for the itinerary
    const itineraryId = newUuid();
    const tripId = `trip-${newUuid()}`;

    //// JSON Schema definition
    //// This schema forces OpenAI to return structured JSON
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
                          time: {
                            type: 'string',
                            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
                          },
                          duration: {
                            type: 'integer',
                            minimum: 15,
                            maximum: 480,
                          },
                          title: { type: 'string' },
                          description: { type: 'string' },
                          location: { type: 'string' },
                          estimatedCost: {
                            type: 'integer',
                            minimum: 0,
                            maximum: 1000,
                          },
                          bookingUrl: { type: 'string' },
                        },
                        required: [
                          'time',
                          'duration',
                          'title',
                          'description',
                          'location',
                          'estimatedCost',
                          'bookingUrl',
                        ],
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

      //// Call OpenAI Responses API
      //// Gives...
      //// - A system instruction (high-level behavior)
      //// - A user message (URL + extracted text + formatting rules)
      //// - A schema to strictly control JSON output
      const resp = await this.openai.responses.create({
        model: 'gpt-5.2',
        reasoning: { effort: 'low' },
        input: [
          {
            role: 'system',
            content:
              'You are a travel itinerary planner. Return JSON matching the schema exactly.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: [
                  `SOURCE URL: ${url}`,
                  ``,
                  `Use these fixed IDs:`,
                  `itinerary.id = ${itineraryId}`,
                  `itinerary.tripId = ${tripId}`,
                  ``,
                  `Extracted page text:`,
                  clipped,
                  ``,
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
          },
        ],
        text: {
          format: {
            name: 'standard_planner_response',
            type: 'json_schema',
            schema: schema.schema,
          },
        } as any,
      });

      //// Extract structured JSON string from response
      const outputText = (resp as any).output_text ?? '';

      //// Convert JSON string into actual object and return
      return JSON.parse(outputText) as StandardPlannerResponse;

    } catch (err: any) {

      //// Fallback mode
      //// Returns a deterministic itinerary instead of crashing
      console.log('OpenAI error, returning fallback:', err?.message);

      return {
        itinerary: {
          id: itineraryId,
          tripId,
          days: [
            {
              date: new Date().toISOString().slice(0, 10),
              activities: [
                {
                  time: '00:01',
                  duration: 1,
                  title: 'Sample teaser activity',
                  description: 'Fallback itinerary while API unavailable.',
                  location: 'Unknown',
                  estimatedCost: 0,
                  bookingUrl: '',
                },
                {
                  time: '00:01',
                  duration: 1,
                  title: 'Second sample stop',
                  description: 'Error when generating itinerary.',
                  location: 'Unknown',
                  estimatedCost: 0,
                  bookingUrl: '',
                },
              ],
            },
          ],
          totalEstimatedCost: {
            min: 0,
            max: 0,
            currency: 'USD',
          },
        },
      };
    }
  }

  //// Fetch webpage HTML
  //// Uses Node's built-in fetch API
  private async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Link2Itinerary MVP)',
      },
    });

    if (!res.ok) {
      throw new BadRequestException(
        `Failed to fetch URL (${res.status})`,
      );
    }

    return await res.text();
  }

  //// Extract readable text from HTML using Cheerio
  private extractText(html: string): string {
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header, noscript, iframe').remove();

    const text =
      $('main').text().trim() ||
      $('article').text().trim() ||
      $('body').text().trim();

    return text.replace(/\s+/g, ' ').trim();
  }
}

