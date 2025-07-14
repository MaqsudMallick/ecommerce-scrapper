// src/app/api/products/route.ts
import { getJson } from 'serpapi';
import { NextRequest } from 'next/server';
import { Product } from '@/types/products';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return Response.json({ error: 'Missing url' }, { status: 400 });

  try {
    const serpApiKey = process.env.SERPAPI_API_KEY || '275056eb0b030e3d88aaeb57664548914d4033e86b2dbf79e19199faff4c522a';
    const urlObject = new URL(url); 
    const searchParams = Object.fromEntries(urlObject.searchParams.entries());
    
                // Add the API key
    searchParams['api_key'] = serpApiKey;
    
    const data = await new Promise<SerpApiProductResponse>((resolve, reject) => {
        getJson(searchParams, (json) => {
            if (json.error) return reject(json.error);
            resolve(json);
        });
    });
    
    
    const product: Product = {
      title: data.product_results?.title || '',
      price: '',
      mrp: '',
      discount: '',
      image: '',
      rating: data.product_results?.rating?.toString() || '',
      link: data.sellers_results?.online_sellers?.[0]?.direct_link || '',
      deliveryDate: data.sellers_results?.online_sellers?.[0]?.details_and_offers?.[0]?.text || '', // Not available in SerpApi response
    };
    
    return Response.json({ product });
  } catch (err: unknown) {
    console.error('❌ SerpApi error:', (err as Error).message || err);
    return new Response((err as Error).message || 'SerpApi error', { status: 500 });
  }
}


type SerpApiProductResponse = {
  product_results?: {
    title: string;
    rating: number;
  };
  sellers_results?: {
    online_sellers: {
      direct_link: string;
      details_and_offers: { text: string }[];
    }[];
  };
};