import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe, faDatabase, faCalendarAlt, faDollarSign,
  faBolt, faBarcode, faTimes,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import { useNavigate } from "react-router-dom";
import { setLoading, toggleModal, useFunds } from "../../features/wallet/walletSlice";
import generaterandomTransactionId from "../../utils/helpers/generaterandomTransactionId";
import { orderEsimProfiles, savePaymentData } from "../../features/payment/paymentSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

export default function ProductList() {
  const dispatch = useDispatch();
  const { pricePercentage } = useSelector((state) => state.settings);
  const { items } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth);
  const { loading: walletLoading, balance } = useSelector((state) => state.wallet);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items]);

  const productsWithIds = useMemo(() => items.map((product) => ({
    ...product, id: product.id || uuidv4(),
  })), [items]);

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

  const handleBuyNow = async () => {
    try {
      const totalAmount = Number(getPriceWithMarkup(selectedPackage.price, pricePercentage));
      dispatch(setLoading(true));
      const packageInfoListForWallet = [{
        packageCode: selectedPackage.packageCode,
        price: selectedPackage.price * 10000,
        count: 1,
      }];

      const transactionId = generaterandomTransactionId();

      const esimOrderResult = await dispatch(orderEsimProfiles({
        transactionId,
        amount: String(totalAmount),
        packageInfoList: packageInfoListForWallet,
      }));

      if (!esimOrderResult.payload?.success) {
        throw new Error("eSim Order Failed: " + JSON.stringify(esimOrderResult.payload));
      }

      const saveResult = await dispatch(savePaymentData({
        transactionId,
        amount: String(esimOrderResult.payload.amount),
        currency: "USD",
        packageInfoList: packageInfoListForWallet.map((pkg) => ({
          ...pkg,
          price: getPriceWithMarkup(pkg.price / 10000, pricePercentage),
        })),
        orderNo: esimOrderResult.payload.data.orderNo,
      }));

      if (!saveResult?.payload?.success) {
        throw new Error("Payment Save Failed: " + JSON.stringify(saveResult.payload));
      }

      const result = await dispatch(useFunds({
        transactionId,
        amount: esimOrderResult.payload.amount,
        currency: "USD",
      }));

      if (useFunds.fulfilled.match(result)) {
        showSuccessToast("eSIM issued to you, enjoy roaming!");
        document.body.classList.toggle("overflow-hidden", false);
        window.location.href = "/esims";
      } else {
        throw new Error("You don't have enough funds in your wallet to make this purchase.");
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBuyNowLogin = async () => {
    localStorage.setItem("purchasePending", JSON.stringify(selectedPackage));
    document.body.classList.toggle("overflow-hidden", false);
    navigate('/login', { replace: true });
  };

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
              <span className="text-lg font-semibold">${getPriceWithMarkup(product.price, pricePercentage)}</span>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="relative bg-[url('/images/auth/auth-bg.png')] p-6 rounded-2xl w-[400px] text-white shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
            <h2 className="text-xl text-white font-bold mb-4">{selectedPackage.name}</h2>

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
                <strong>Price:</strong> ${getPriceWithMarkup(selectedPackage.price, pricePercentage)}
              </p>
            </div>

            {user == null && (
              <button
                className="mt-4 w-full bg-white text-orange-600 rounded-full py-3 font-semibold hover:bg-gray-200 transition-colors"
                onClick={handleBuyNowLogin}
              >
                Buy Now
              </button>
            )}

            {!!user?.email && !walletLoading && (balance < getPriceWithMarkup(selectedPackage.price, pricePercentage)) && (
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-1">
                  Insufficient Funds
                </h3>
                <p className="text-sm text-center mb-4">
                  Please top up your wallet to buy now your eSIM.
                </p>
                <button
                  onClick={() => dispatch(toggleModal(true))}
                  className="w-full bg-white text-orange-600 rounded-full py-3 font-semibold hover:bg-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  Top Up Wallet
                </button>
              </div>
            )}

            {!!user?.email && !walletLoading && (balance >= getPriceWithMarkup(selectedPackage.price, pricePercentage)) && (
              <button
                className="mt-4 w-full bg-white text-orange-600 rounded-full py-3 font-semibold hover:bg-gray-200 transition-colors"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            )}


            {walletLoading && (
              <button className="mt-4 w-full text-white cursor-wait border rounded-full py-3 font-semibold"              >
                Processing...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
