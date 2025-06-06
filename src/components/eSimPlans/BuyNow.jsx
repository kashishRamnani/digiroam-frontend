import { useDispatch, useSelector } from "react-redux";
import { setBuyNow, setSelectedProduct, toggleModal, useFunds } from "../../features";
import { orderEsimProfiles, savePaymentData } from "../../features/payment/paymentSlice";
import { setLoading } from "../../features/wallet/walletSlice";

import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import generaterandomTransactionId from "../../utils/helpers/generaterandomTransactionId";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import formatBalance from "../../utils/helpers/formateBalance";
import { useNavigate } from "react-router-dom";

const BuyNowModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isBuyNow, selectedProduct } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const { balance, loading: walletLoading } = useSelector((state) => state.wallet);

  if (!isBuyNow || !selectedProduct) return null;

  const handleClose = () => {
    localStorage.removeItem("purchasePending");
    dispatch(setBuyNow(false));
    dispatch(setSelectedProduct(null));
  };

  const totalAmount = Number(getPriceWithMarkup(selectedProduct.price, pricePercentage));
  const handleWalletClick = async () => {
    try {
      dispatch(setLoading(true));
      const packageInfoListForWallet = [{
        packageCode: selectedProduct.packageCode,
        price: selectedProduct.price * 10000,
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
        localStorage.removeItem("purchasePending");
        dispatch(setBuyNow(false));
        dispatch(setSelectedProduct(null));
        showSuccessToast("eSIM issued to you, enjoy roaming!");
        navigate("/esims", { replace: true });
      } else {
        throw new Error("You don't have enough funds in your wallet to make this purchase.");
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
      role="dialog"
      aria-labelledby="buy-now-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>

        <h3 id="buy-now-title" className="text-2xl font-semibold mb-6 text-gray-800 z-10 relative">
          Buy Now
        </h3>

        {walletLoading && (
          <div className="absolute top-[4.5rem] left-0 right-0 bottom-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center px-4">
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-gray-700 animate-pulse">Processing...</div>
            </div>
          </div>
        )}

        <div className={walletLoading ? "pointer-events-none select-none opacity-60" : ""}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span>{selectedProduct.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Data</span>
              <span>{getFormattedVolume(selectedProduct.volume)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span>
                {selectedProduct.duration} {selectedProduct.durationUnit}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Price</span>
              <span>${formatBalance(totalAmount)}</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Chargeable Amount</span>
              <span className="text-xl font-bold">${formatBalance(totalAmount)}</span>
            </div>
          </div>

          {parseFloat(formatBalance(balance)) < totalAmount ? (
            <div className="mt-4">
              <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-1">
                Insufficient Funds
              </h3>
              <p className="text-sm text-center text-gray-600 mb-4">
                Please top up your wallet to buy now your eSIM.
              </p>
              <button
                onClick={() => dispatch(toggleModal(true))}
                className="w-full text-white hover:bg-blue-50 transition px-4 py-2 rounded-lg text-sm font-medium shadow"
                style={{ backgroundColor: 'var(--secondary-color)' }}
              >
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Top Up Wallet
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                onClick={handleWalletClick}
                disabled={walletLoading}
                className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-primary-dark"
              >
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
