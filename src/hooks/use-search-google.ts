'use client';

import { useState } from 'react';
import axios from 'axios';
import { Product } from '@/types/products';
import useDebounce from './use-debounce';

const DEFAULT_DELAY = 1000; // ms

const useSearchGoogle = (q: string, sortBy: string | null, delay = DEFAULT_DELAY) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);

  useDebounce(
    async () => {
      setError(null);
      if (!q.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      let productData: Product[] = []
      try {
        let url = `/api/google?q=${encodeURIComponent(q)}`;
        if(sortBy) {
          url += `&sortBy=${sortBy}`;
        }
        const { data } = await axios.get<{ products: Product[] }>(
          url
        );
        productData = data.products;
        setProducts(data.products);
      } catch (err: unknown) {
        setError((err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }

      if(productData.length === 0) {
        return;
      }

      try {
        setLinkLoading(true);

        for (const _product of productData) {
            

            const {data} = await axios.get<{product: Product}>("/api/google/product?url=" + encodeURIComponent(_product.link));
            const prevProductLink = _product.link;
            const { product } = data;
            _product.title = product.title;
            _product.rating = product.rating;
            _product.link = product.link;
            _product.deliveryDate = product.deliveryDate;
            setProducts((prevProducts) =>  {
                const otherProducts = prevProducts.filter((product) => product.link !== prevProductLink);
                return [...otherProducts, _product]
            });
        }

        } catch (err: unknown) {
        setError((err as Error).message);
        console.error(err);
        } finally {
        setLinkLoading(false);
        }
    },
    [q, sortBy],     
    delay  
  );

  return { products, loading, error, linkLoading };
};

export default useSearchGoogle;
