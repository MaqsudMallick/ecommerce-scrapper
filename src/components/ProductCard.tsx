import { Product } from "@/types/products";
import { Card, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={product.link}>
      <Card className="w-full">
        <CardHeader className="grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-[180px_1fr] items-center gap-4">
          <div className="w-full h-40 flex justify-center items-center">
            <img src={product.image} alt={product.title} className="max-w-[200px] h-full rounded-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-sm">{product.price}</p>
            {product.rating !== '' && <p className="text-sm">
              {product.rating} stars
            </p>}
            <p className="text-sm flex items-center gap-2">
              Delivered by {
                product.deliveryDate !== ''
                  ? product.deliveryDate
                  : <span><Image src="/loading.svg" alt="Loading..." width={20} height={20} /></span>
              }
            </p>
          </div>          
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ProductCard;