export const runtime = 'nodejs';
import logger from '@/lib/winston';
import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest } from 'next/server';
import { SCRAPER_API_KEY, SCRAPER_API_URL } from '@/lib/constants';

async function fetchWithScraperAPI(targetUrl: string): Promise<string> {
  const response = await axios.get(SCRAPER_API_URL, {
    params: {
      api_key: SCRAPER_API_KEY,
      url: targetUrl,
      country_code: 'in',
      device_type: 'desktop'
    },
  });
  return response.data;
}

export async function GET(req: NextRequest) {
  logger.info(`🧠 Running delivery date scrapper in runtime: ${process.env.NEXT_RUNTIME || 'nodejs'}`);

  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'Missing url' }, { status: 400 });
  }

  try {
    const detailsHtml = await fetchWithScraperAPI(url);
    const details$ = cheerio.load(detailsHtml);
    const deliveryDate = details$('.Y8v7Fl').first().text().trim();

    logger.info(`✅ Successfully fetched delivery date: ${deliveryDate} for Flipkart product '${url}'`);
    return Response.json({ deliveryDate });
  } catch (err: unknown) {
    logger.error('❌ ScraperAPI error: ' + (err as Error).message);
    if (err instanceof AxiosError && err.response?.status === 429) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
    return new Response((err as Error).message, { status: 500 });
  }
}
