export const runtime = 'nodejs';
import logger from '@/lib/winston';
import { Product } from '@/types/products';
import { SortOptions } from '@/types/sort-options';
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
      device_type: 'desktop',
      premium: true,
    },
  });
  return response.data;
}

export async function GET(req: NextRequest) {
  logger.info(`🧠 Running scrapper in runtime: ${process.env.NEXT_RUNTIME || 'nodejs'}`);

  const q = req.nextUrl.searchParams.get('q');
  const sortBy = req.nextUrl.searchParams.get('sortBy') as SortOptions;

  if (sortBy && !Object.values(SortOptions).includes(sortBy)) {
    return Response.json({ error: 'Invalid sortBy' }, { status: 400 });
  }
  if (!q) {
    return Response.json({ error: 'Missing q' }, { status: 400 });
  }

  try {
    let searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`;
    if (sortBy === SortOptions.PRICE_ASC) searchUrl += '&sort=price_asc';
    else if (sortBy === SortOptions.PRICE_DESC) searchUrl += '&sort=price_desc';

    const html = await fetchWithScraperAPI(searchUrl);
    const $ = cheerio.load(html);
    let products: Product[] = [];

    if ($('.tUxRFH').length !== 0) {
      products = $('.tUxRFH').map((_, el) => {
        const card = $(el);
        const anchor = card.find('a.CGtC98').first();
        return {
          title: card.find('.KzDlHZ').first().text().trim(),
          price: card.find('.Nx9bqj').first().text().trim(),
          mrp: card.find('.yRaY8j').first().text().trim(),
          discount: card.find('.UkUFwK span').first().text().trim(),
          rating: card.find('.XQDdHH').first().text().trim(),
          image: card.find('img.DByuf4').attr('src') ?? '',
          link: 'https://www.flipkart.com' + anchor.attr('href'),
          deliveryDate: '',
        };
      }).get();
    } else if ($('.LFEi7Z').length !== 0) {
      products = $('.LFEi7Z').map((_, el) => {
        const card = $(el);
        const anchor = card.find('a.rPDeLR').first();
        return {
          title: card.find('.syl9yP').first().text().trim() + ' ' + card.find('.BwBZTg').first().text().trim(),
          price: card.find('.Nx9bqj').first().text().trim(),
          mrp: card.find('.yRaY8j').first().text().trim(),
          discount: card.find('.UkUFwK span').first().text().trim(),
          rating: '',
          image: card.find('img._53J4C-').attr('src') ?? '',
          link: 'https://www.flipkart.com' + anchor.attr('href'),
          deliveryDate: '',
        };
      }).get();
    } else {
      products = $('.slAVV4').map((_, el) => {
        const card = $(el);
        const anchor = card.find('a.VJA3rP').first();
        return {
          title: card.find('.wjcEIp').first().text().trim() + ' (' + card.find('.NqpwHC').first().text().trim() + ')',
          price: card.find('.Nx9bqj').first().text().trim(),
          mrp: card.find('.yRaY8j').first().text().trim(),
          discount: card.find('.UkUFwK span').first().text().trim(),
          rating: card.find('.XQDdHH').first().text().trim(),
          image: card.find('img.DByuf4').attr('src') ?? '',
          link: 'https://www.flipkart.com' + anchor.attr('href'),
          deliveryDate: '',
        };
      }).get();
    }

    logger.info(`✅ Successfully fetched ${products.length} Flipkart products for query '${q}'`);
    return Response.json({ products });
  } catch (err: unknown) {
    logger.error('❌ ScraperAPI error: ' + (err as Error).message);
    if (err instanceof AxiosError && err.response?.status === 429) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
    return new Response((err as Error).message, { status: 500 });
  }
}
