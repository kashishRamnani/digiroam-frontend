import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

export default function HomeProductListing() {
  const { items } = useSelector((state) => state.plans);

  const displayedProducts = useMemo(() => {
    const uniqueProducts = [];
    const seenIds = new Set();

    for (let product of items) {
      if (!seenIds.has(product.id)) {
        uniqueProducts.push(product);
        seenIds.add(product.id);
      }
      if (uniqueProducts.length >= 6) break;
    }
    return uniqueProducts;
  }, [items]);

  return (
    <div className="mx-auto px-5 py-8 flex justify-center">
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 px-8 ">
        {displayedProducts.map((product, index) => (
          <div key={product.id || index} className="flex justify-center">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
