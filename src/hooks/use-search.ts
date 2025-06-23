'use client';

import { useState } from 'react';
import axios from 'axios';
import { Product } from '@/types/products';
import useDebounce from './use-debounce';

const DEFAULT_DELAY = 1000; // ms

const useSearch = (q: string, sortBy: string | null, delay = DEFAULT_DELAY) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryDateError, setDeliveryDateError] = useState<string | null>(null);

  useDebounce(
    async () => {
      setError(null);
      setDeliveryDateError(null);
      if (!q.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      let productData: Product[] = []
      try {
        let url = `/api/flipkart?q=${encodeURIComponent(q)}`;
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
        const url = `/api/flipkart/delivery-date?url=${encodeURIComponent(productData[0].link)}`;
        const { data } = await axios.get<{ deliveryDate: string }>(
          url
        );
        setProducts(productData.map(product => ({...product, deliveryDate: data.deliveryDate})));
      }
      catch (err: unknown) {
        setDeliveryDateError((err as Error).message);
        console.error(err);
      } 
    },
    [q, sortBy],     
    delay  
  );

  return { products, loading, error, deliveryDateError };
};

export default useSearch;
