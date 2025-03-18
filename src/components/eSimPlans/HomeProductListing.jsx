import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

export default function HomeProductListing() {
  const { items } = useSelector((state) => state.plans);

  
  const displayedProducts = items.slice(0, 6);

  return (
    <>
      <div className=" mx-auto px-4 py-8 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {displayedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
  
    </>
  );
}
