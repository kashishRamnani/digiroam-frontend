import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBuyNow,
  setLoading,
  toggleModal,
  useFunds,
} from "../../features";
import {
  orderEsimProfiles,
  savePaymentData,
} from "../../features/payment/paymentSlice";
import { clearFromCart } from "../../features/carts/cartSlice";

import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import generaterandomTransactionId from "../../utils/helpers/generaterandomTransactionId";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

const BuyNowModal = () => {
  const dispatch = useDispatch();

  const { isBuyNow, selectedProduct } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const { balance, loading: walletLoading } = useSelector((state) => state.wallet);

  if (!isBuyNow || !selectedProduct) return null;

  const handleClose = () => {
    dispatch(setBuyNow(false));
  };

  const total = Number(getPriceWithMarkup(selectedProduct.price, pricePercentage)) || 0;
  const totalAmountForWallet = Math.round(total * 10000);

  const handleWalletClick = async () => {
    try {
      dispatch(setLoading(true));
      const packageInfoListForWallet = [{
        packageCode: selectedProduct.packageCode,
        price: Math.round(selectedProduct.price * 10000),
        count: 1,
      }];

      const transactionId = generaterandomTransactionId();

      const esimOrderResult = await dispatch(orderEsimProfiles({
        transactionId,
        amount: String(totalAmountForWallet),
        packageInfoList: packageInfoListForWallet,
      }));

      if (!esimOrderResult.payload?.success) {
        throw new Error("eSim Order Failed: " + JSON.stringify(esimOrderResult.payload));
      }

      const saveResult = await dispatch(savePaymentData({
        transactionId,
        amount: String(totalAmountForWallet),
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
        amount: totalAmountForWallet,
        currency: "USD",
      }));

      if (useFunds.fulfilled.match(result)) {
        showSuccessToast("eSIM issued to you, enjoy roaming!");
        await dispatch(clearFromCart());
        window.location.href = "/esims";
      } else {
        throw new Error("You don't have enough funds in your wallet to make this purchase.");
      }
    } catch (error) {
      console.error("BuyNowModal Error:", error);
      showErrorToast(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="buy-now-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>

        <h3 id="buy-now-title" className="text-2xl font-semibold mb-6 text-gray-800">
          Buy Now
        </h3>

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
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="relative max-w-md mx-auto bg-white mt-6">
          {walletLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center space-y-2">
                <div className="text-xl font-semibold text-gray-700 animate-pulse">
                  Processing...
                </div>
              </div>
            </div>
          )}

          {(parseInt(balance) < getPriceWithMarkup(totalAmountForWallet / 10000, pricePercentage)) && (
            <>
              <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-1">
                Insufficient Funds
              </h3>
              <p className="text-sm text-center text-gray-600 mb-4">
                Please top up your wallet to proceed with your eSIM purchase.
              </p>
            </>
          )}
          {!(parseInt(balance) < getPriceWithMarkup(totalAmountForWallet / 10000, pricePercentage))}

          <div className="flex items-center justify-center space-x-4 mb-6">
            {(parseInt(balance) < getPriceWithMarkup(totalAmountForWallet / 10000, pricePercentage)) ? (
              <button
                onClick={() => dispatch(toggleModal(true))}

                className="w-full text-white hover:bg-blue-50 transition px-4 py-2 rounded-lg text-sm font-medium shadow"
                style={{ backgroundColor: 'var(--secondary-color)' }}
              >
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Top Up Wallet
              </button>
            ) : (
              <button
                onClick={handleWalletClick}
                disabled={walletLoading}
                className="w-full py-2 px-4 text-white rounded-md bg-primary hover:bg-primary-dark"
              >
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Pay with Wallet
              </button>
            )}

</div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
