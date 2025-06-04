import { useEffect,  useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { addToCart,retrieveSettings } from "../../features";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe, faDatabase, faCalendarAlt, faDollarSign,
  faBolt, faBarcode, faTimes,
} from "@fortawesome/free-solid-svg-icons";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import BuyNowModal from "./BuyNow";
import { useNavigate } from "react-router-dom";
export default function ProductList() {
  const dispatch = useDispatch();
   
   const { pricePercentage } = useSelector((state) => state.settings);
   
  const { items } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (items.length === 0) {
        
      dispatch(fetchProducts());
    }
  }, [dispatch, items]);


  
  const productsWithIds = useMemo(
    () =>
      items.map((product) => ({
        ...product,
        id: product.id || uuidv4(),
      })),
    [items]
  );
  
  const getLowestPricePackages = useCallback((products) => {
    if (!products || products.length === 0) return [];

    const groupedByCategory = products.reduce((acc, product) => {
      const category = product.name.split(/(\d+GB|\(.*\))/)[0].trim().toLowerCase();
      if (!acc[category] || product.price < acc[category].price) {
        acc[category] = product;
      }
      return acc;
    }, {});

    return Object.values(groupedByCategory).slice(0, 6);
  }, []);
  
  const lowestPricePackages = useMemo(() => getLowestPricePackages(productsWithIds), [productsWithIds, getLowestPricePackages]);

 const handleBuyNow = useCallback(() => {
  if (!selectedPackage) return;

  localStorage.setItem("pendingPackageCode", selectedPackage.packageCode);

  if (!user) {
    window.location.href = "/login";
    return;
  }

  window.location.href = "/eSim-plans";
}, [user, selectedPackage]);


  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isModalOpen);
  }, [isModalOpen]);

  if (lowestPricePackages.length === 0) {
    return <p className="text-red-600">No products available</p>;
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-24  ">
      {lowestPricePackages.map((product) => (
        <div key={product.id} className="relative bg-[url('/images/auth/auth-bg.png')] rounded-2xl p-4 text-white shadow-lg max-w-sm w-[350px]">
          <div className="absolute -top-12  left-1/2 -translate-x-1/2 w-64 h-36 rounded-xl overflow-hidden">
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

            {/* Data */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faDatabase} className="w-6 h-6" />
            <span className="text-lg">DATA</span>
          </div>
          <span className="text-lg font-semibold">
          {getFormattedVolume(product.volume)}
          </span>
        </div>

            {/* Validity */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
            <span className="text-lg">VALIDITY</span>
          </div>
          <span className="text-lg font-semibold">
            {product.duration} {product.durationUnit}
          </span>
        </div>

            {/* Price */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} className="w-6 h-6" />
            <span className="text-lg">PRICE</span>
          </div>
          <span className="text-lg font-semibold">${getPriceWithMarkup(product.price , pricePercentage )}</span>
         
        </div>


            {/* Details Button */}
            <button
              className="w-full bg-white text-orange-600 rounded-full py-3 font-semibold hover:bg-orange-50 transition-colors"
              onClick={() => {
                setSelectedPackage(product);
                setIsModalOpen(true);
              }}
            >
              Details
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-[url('/images/auth/auth-bg.png')] p-6 rounded-2xl w-[400px] text-white shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedPackage.name}</h2>

            <div className="space-y-2 mt-4">
              <p>
                <FontAwesomeIcon icon={faBolt} className="mr-2" />
                <strong>Speed:</strong> {selectedPackage.speed}
              </p>
              <p>
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <strong>Validity:</strong> {selectedPackage.duration} {selectedPackage.durationUnit}
              </p>
              <p>
                <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                <strong>Data</strong> {getFormattedVolume(selectedPackage.volume)}
              </p>
              <p>
                <FontAwesomeIcon icon={faBarcode} className="mr-2" />
                <strong>Package Code:</strong> {selectedPackage.packageCode}
              </p>
              <p>
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                <strong>Price:</strong> ${getPriceWithMarkup(selectedPackage.price , pricePercentage )}
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
