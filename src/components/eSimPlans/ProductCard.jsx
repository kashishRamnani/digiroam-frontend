import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../features";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faDatabase,
  faCalendarAlt,
  faDollarSign,
  faBolt,
  faBarcode,
  faTag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function ProductCard({ productId }) {
  const dispatch = useDispatch();
 
  const { items } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth); 

  const product = items.find((item) => item.id === productId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product) {
    return <p className="text-red-600">Product not found</p>;
  }

  const handleToPackageDetails = () => {
    setIsModalOpen(true);
  };

  const handleBuyNow = () => {
    if (!user) {
      window.location.href = "/login"; 
    } else {
      dispatch(addToCart({ product, quantity: 1 }));
      window.location.href = "/eSim-plans"; 
    }
  };
  

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isModalOpen]);

  return (
    <div className="relative bg-[url('/images/auth/auth-bg.png')] rounded-2xl p-4 text-white shadow-lg max-w-sm w-[350px]">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-36 rounded-xl overflow-hidden">
        <img src="/images/home/product-card.png" alt="Digital Globe" />
      </div>

      <div className="pt-24 space-y-3">
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faGlobe} className="w-6 h-6" />
            <span className="text-lg">COVERAGE</span>
          </div>
          <span className="text-lg font-semibold">
            {product.name.split(/(\d+GB|\(.*\))/)[0].trim()}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faDatabase} className="w-6 h-6" />
            <span className="text-lg">DATA</span>
          </div>
          <span className="text-lg font-semibold">
            {(product.volume / (1024 * 1024 * 1024)).toFixed(0)}GB
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
            <span className="text-lg">VALIDITY</span>
          </div>
          <span className="text-lg font-semibold">
            {product.duration} {product.durationUnit}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} className="w-6 h-6" />
            <span className="text-lg">PRICE</span>
          </div>
          <span className="text-lg font-semibold">$ {product.price} USD</span>
        </div>

        <button
          className="w-full bg-white text-orange-600 rounded-full py-3 font-semibold hover:bg-orange-50 transition-colors"
          onClick={handleToPackageDetails}
        >
          Details
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-[url('/images/auth/auth-bg.png')] p-6 rounded-2xl w-[400px] text-white shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{product.name}</h2>

            <div className="space-y-2 mt-4">
              <p>
                <FontAwesomeIcon icon={faBolt} className="mr-2" />
                <strong>Speed:</strong> {product.speed}
              </p>
              <p>
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <strong>Validity:</strong> {product.duration} {product.durationUnit}
              </p>
              <p>
                <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                <strong>Data:</strong>{" "}
                {(product.volume / (1024 * 1024 * 1024)).toFixed(0)}GB
              </p>
              <p>
                <FontAwesomeIcon icon={faBarcode} className="mr-2" />
                <strong>Package Code:</strong> {product.packageCode}
              </p>

              <p>
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                <strong>Price:</strong> $ {product.price} USD
              </p>
            </div>

            <button
              className="mt-4 w-full bg-white text-orange-600 rounded-full py-3 font-semibold hover:bg-gray-200 transition-colors"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
