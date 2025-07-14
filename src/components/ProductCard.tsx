'use client';
import { Product } from "@/types/products";
import { Card, CardHeader } from "./ui/card";
import Image from "next/image";
const ProductCard = ({ product, linkLoading }: { product: Product, linkLoading: boolean }) => {
  return (
    <div onClick={() => {
      if(linkLoading) {
        alert("Link not yet loaded");
      }
      else {
        window.open(product.link, '_blank');
      }
    }}>
      <Card className="w-full">
        <CardHeader className="grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-[180px_1fr] items-center gap-4">
          <div className="w-full h-40 flex justify-center items-center">
            <img src={product.image} alt={product.title} className="max-w-[200px] h-full rounded-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-sm">{product.price}</p>
            {product.price == '' && <p>{product.mrp}</p>}
            {product.rating !== '' && <p className="text-sm">
              {product.rating} stars
            </p>}
            <p className="text-sm flex items-center gap-2">
              {
                product.deliveryDate !== ''
                  ? product.deliveryDate
                  : <span><Image src="/loading.svg" alt="Loading..." width={20} height={20} /></span>
              }
            </p>
          </div>          
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProductCard;