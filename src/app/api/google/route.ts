// src/app/api/products/route.ts
import { getJson } from 'serpapi';
import { NextRequest } from 'next/server';
import { Product } from '@/types/products';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return Response.json({ error: 'Missing q' }, { status: 400 });

  try {
    const serpApiKey = process.env.SERPAPI_API_KEY || '275056eb0b030e3d88aaeb57664548914d4033e86b2dbf79e19199faff4c522a';

    const json = await new Promise<unknown & { immersive_products: ImmersiveProductsPayload[] }>((resolve, reject) => {
      getJson(
        {
          api_key: serpApiKey,
          engine: 'google',
          q: `${q} products`,
          location: 'India',
          google_domain: 'google.co.in',
          gl: 'in',
          hl: 'en',
          device: 'desktop',
        },
        (data) => {
          if (data.error) return reject(data.error);
          resolve(data as unknown & { immersive_products: ImmersiveProductsPayload[] });
        }
      );
    });
    
    const products: Product[] = (json.immersive_products || []).map((item: ImmersiveProductsPayload) => ({
      title: item.title || '',
      price: item.price || '',
      mrp: item.original_price || '',
      discount: item.extracted_original_price ? `${item.extracted_original_price}% off` : '',
      image: item.thumbnail || '',
      rating: item.rating || '', 
      link: item.serpapi_product_api || '',
      deliveryDate: item.delivery || '', // Not available in SerpApi response
    }));
    
    return Response.json({ products: products.filter((product: Product, index: number) => products.findIndex(p => p.link === product.link) === index) });
  } catch (err: unknown) {
    console.error('❌ SerpApi error:', (err as Error).message || err);
    return new Response((err as Error).message || 'SerpApi error', { status: 500 });
  }
}


type ImmersiveProductsPayload = {
  title: string;
  price: string;
  rating: string;
  original_price: string;
  extracted_original_price: string;
  thumbnail: string;
  delivery: string;
  serpapi_product_api: string;
};