'use client';
import { useFilter } from "@/components/FilterContext";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/use-search";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

const Home = () => {
  const { sortBy } = useFilter();
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const {products, loading, error, deliveryDateError} = useSearch(query, sortBy);
  return (
    <div className="grid grid-rows-[120px_100px_1fr] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Listing Demo</h1>
        <p className="text-lg text-center">
          This is a simple Product Listing demo built with Next.js and Tailwind CSS.
        </p>
      </div>
      <div className="w-full sm:w-120 md:w-240 grid grid-cols-[1fr_30px] gap-4">
        <Input
          placeholder="Search for products..."
          className="w-full rounded-lg border-2 border-gray-300 p-4 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="border-2 border-gray-300 rounded-md flex flex-col items-center justify-center">
          <Image
            src="/filter.svg"
            alt="Filter"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => router.push('/filters')}
          />
        </div>
        
      </div>
      
      <div className="w-full flex flex-col gap-4">
        {deliveryDateError && <div className="w-full h-full flex justify-center items-center">
          <p className="text-red-500">Error: {deliveryDateError}</p>
        </div>}
        {error && <div className="w-full h-full flex justify-center items-center">
          <p className="text-red-500">Error: {error}</p>
        </div>}
        {loading && <div className="w-full h-full flex justify-center items-center">
          <Image src="/loading.svg" alt="Loading..." width={80} height={80} />
        </div>}
        {products && Array.isArray(products) && products.length > 0 && products.map((product) => {
          return <ProductCard product={product} key={product.link} />;
        })}
        {products && Array.isArray(products) && products.length == 0 && !loading && !error && (<>
          <div className="w-full h-full flex justify-center items-center">
            <Image src="/loading.svg" alt="Loading..." width={80} height={80} />
          </div>
          <p className="text-lg text-center">Search something to find products</p>
        </>)}
        
      </div>
    </div>
  );
}

export default function HomeWrapper() {
  return (
    <Suspense fallback={<Fallback />}>
      <Home />
    </Suspense>
  )
}

const Fallback = () => {
  return <div className="w-full h-full flex justify-center items-center">
            <Image src="/loading.svg" alt="Loading..." width={80} height={80} />
          </div>
}