import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { resetPaymentState, retrieveSettings, setPaymentStatus, useFunds } from "../../features";
import {
  capturePayPalOrder,
  createStripePaymentIntent,
  generatePayPalOrderId,
  orderEsimProfiles,
  savePaymentData,
} from "../../features/payment/paymentSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal, faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { clearFromCart } from "../../features/carts/cartSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import { faArrowUp, faWallet } from "@fortawesome/free-solid-svg-icons";
import { setLoading } from "../../features/wallet/walletSlice";
import generaterandomTransactionId from "../../utils/helpers/generaterandomTransactionId";
import { toggleModal } from "../../features";
// const stripePromise = loadStripe("pk_test_51PtX1yP5I2dh2w2olaE2SXdVYWT056atlVJ3jVZKliMu6GQUa17xzEQHTrELjjJRWal7JwTySuFZLdeNJ7SGwrX700LCXKN0LP");
const stripePromise = loadStripe("pk_live_51RdnSxKHzu3znY3yPhZPiLg6Ly59sOOccilESSNNlumXvqQUOGtm7oio0Yns8v5Iye3hN61WpcBizP010quOWSuy00ZQhSUY3b");

const PaymentButtons = () => {
  const dispatch = useDispatch();
  const { stripeClientSecret, loading, error, paymentStatus, paypalOrderId } =
    useSelector((state) => state.payment);
  const { items } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const { balance, loading: walletLoading } = useSelector((state) => state.wallet);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const totalAmountForWallet = items.reduce(
    (total, item) => total + (Number(item.productPrice * 10000).toFixed(0) * item.productQuantity),
    0
  );

  const handleWalletClick = async () => {
    try {
      dispatch(setLoading(true));
      const packageInfoListForWallet = items.map((pkg) => ({
        packageCode: pkg.productId,
        price: pkg.productPrice * 10000,
        count: pkg.productQuantity
      }));

      const transactionId = generaterandomTransactionId();

      const esimOrderResult = await dispatch(orderEsimProfiles({
        transactionId,
        amount: String(totalAmountForWallet),
        packageInfoList: packageInfoListForWallet,
      }));

      if (!esimOrderResult.payload?.success) {
        throw new Error("eSim Order Failed: " + esimOrderResult.payload);
      }

      // const amount = items.reduce((total, { productPrice, productQuantity }) => total + Number(getPriceWithMarkup(productPrice, pricePercentage) * 10000).toFixed(2) * productQuantity, 0);
      const amount = esimOrderResult.payload.amount;
      const saveResult = await dispatch(
        savePaymentData({
          transactionId,
          amount: String(amount),
          currency: "USD",
          packageInfoList: packageInfoListForWallet?.map((pkg) => ({ ...pkg, price: (getPriceWithMarkup(pkg.price / 10000, pricePercentage) * 10000) })),
          orderNo: esimOrderResult.payload.data.orderNo
        })
      );

      if (!saveResult?.payload?.success) {
        throw new Error("Failed to save payment data");
      }
      const result = await dispatch(useFunds({ transactionId, amount, currency: "USD" }))
      if (useFunds.fulfilled.match(result)) {
        showSuccessToast("ESim issued to you, Enjoying roaming!");
        await dispatch(clearFromCart());
        window.location.href = "/esims";
      } else throw new Error("You don't have enough funds in your wallet to make this purchase");
    } catch (error) {
      dispatch(setLoading(false));
      showErrorToast(error.message);
    }
  }

  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  const sanitizeMetadata = (metadata) => {
    return Object.fromEntries(
      Object.entries(metadata || {}).map(([key, value]) => [
        key,
        typeof value === "string" && value.length > 500
          ? value.substring(0, 500)
          : value,
      ])
    );
  };

  const handlePayPalClick = () => setPaymentMethod("paypal");

  const handleStripeClick = async () => {
    setPaymentMethod("stripe");

    try {
      const totalAmount = items.reduce(
        (total, item) => total + (getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity),
        0
      );
      const response = await dispatch(
        createStripePaymentIntent({
          amount: totalAmount,
          currency: "USD",
          metadata: {
            totalItems: items.length,
            orderSummary: items
              .map((item) => `${item.productName} x${item.productQuantity}`)
              .join(", ")
              .slice(0, 500),
          },
        })
      );
    } catch (error) {
      showErrorToast("Error processing Stripe payment:", error);
    }
  };

  const generatePayPalOrderIdHandler = async () => {
    try {
      const result = await dispatch(
        generatePayPalOrderId({
          amount: items.reduce(
            (total, item) => total + getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity,
            0
          ),
          currency: "USD"
        })
      );

      if (result.error) {
        // console.error("PayPal Order Generation Failed:", result.error);
        throw new Error(result.error.message ?? "Unknown error");
      }

      if (!result.payload || !result.payload.orderId) {
        // console.error("PayPal Order ID is missing:", result.payload);
        throw new Error("Failed to generate PayPal order ID");
      }

      return result.payload.orderId;
    } catch (error) {
      showErrorToast(error.message ?? "Error generating PayPal order");
      throw error;
    }
  };

  const onApprovePayPalHandler = async (data, actions) => {
    try {
      // Capture PayPal order
      const result = await dispatch(
        capturePayPalOrder({
          orderId: data.orderID,
          currency_code: "USD",
        })
      );

      if (result.error) throw new Error(result.error);

      dispatch(setPaymentStatus("success"));

      let { transactionId, amount, currency_code, payer, packageInfoList } = result.payload;

      amount = String(amount);

      const esimOrderResult = await dispatch(
        orderEsimProfiles({
          transactionId,
          amount,
          packageInfoList,
        })
      );

      if (!esimOrderResult.payload?.success) {
        throw new Error("eSim Order Failed: " + esimOrderResult.payload);
      }

      amount = items.reduce((total, { productPrice, productQuantity }) => total + Number(getPriceWithMarkup(productPrice, pricePercentage) * 10000).toFixed(2) * productQuantity, 0);
      amount = String(amount);
      const saveResult = await dispatch(
        savePaymentData({
          transactionId,
          amount,
          currency: currency_code,
          payer,
          packageInfoList: packageInfoList?.map((pkg) => ({ ...pkg, price: (getPriceWithMarkup(pkg.price / 10000, pricePercentage) * 10000) })),
          orderNo: esimOrderResult.payload.data.orderNo
        })
      );

      if (saveResult.payload.success) {
        showSuccessToast("Payment & eSim Order Successful!");
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        throw new Error("Failed to save payment data");
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <>
      {items && items.length > 0 && (
        <div className="relative max-w-md mx-auto bg-white">
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
                Pay Now
              </button>
            )}



            {/* <button
              onClick={handlePayPalClick}
              className="flex items-center px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 shadow transition duration-300"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPaypal} className="mr-2" />
              PayPal
            </button>

           
            <button
              onClick={handleStripeClick}
              className="flex items-center px-4 py-2 rounded-lg text-white bg-purple-500 hover:bg-purple-600 shadow transition duration-300"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCcMastercard} className="mr-2" />
              Credit Card
            </button> */}
          </div>

          {/* Loading/Error */}
          {loading && (
            <p className="text-center text-sm text-gray-500 animate-pulse">
              Preparing your payment...
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}

          {/* PayPal Section */}
          {paymentMethod === "paypal" && (
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AdPEMI45IUSGOwz6oeByUS6ltDHzwPQ94NlYEChQoL4cha2bfyNqNAdmr87AMvgxwT68CgIbeD8RI6PM",
              }}
            >
              <PayPalButtons
                createOrder={generatePayPalOrderIdHandler}
                onApprove={onApprovePayPalHandler}
                style={{
                  layout: "horizontal",
                  shape: "pill",
                  color: "gold",
                  tagline: false,
                }}
              />
            </PayPalScriptProvider>
          )}

          {/* Stripe Section */}
          {/* {paymentMethod === "stripe" && stripeClientSecret && (
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm
                clientSecret={stripeClientSecret}
                items={items}
                pricePercentage={pricePercentage}
              />
            </Elements>
          )} */}
        </div>
      )}
    </>
  )
};

const StripeCheckoutForm = ({ clientSecret, items, pricePercentage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe is not properly initialized.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are missing.");
      setProcessing(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(result.error.message);
        showErrorToast(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        let { id: transactionId, amount, currency } = result.paymentIntent;

        // Define missing data
        const currency_code = currency;
        const packageInfoList = items.map((item) => ({
          packageCode: item.productId,
          price: Number(item.productPrice * 10000).toFixed(0),
          count: item.productQuantity,
        }));

        amount = items.reduce(
          (total, item) => total + (Number(item.productPrice * 10000).toFixed(0) * item.productQuantity),
          0
        );

        amount = String(amount);

        // Step 1: Order eSim Profiles
        const esimOrderResult = await dispatch(
          orderEsimProfiles({ transactionId, amount, packageInfoList })
        );

        if (!esimOrderResult.payload?.success) {
          showErrorToast("eSim Order Failed: " + esimOrderResult.payload);
          return;
        }

        // Step 2: Save Payment Data
        const saveResult = await dispatch(
          savePaymentData({
            transactionId,
            amount: items.reduce(
              (total, item) => total + (Number(getPriceWithMarkup(item.productPrice, pricePercentage) * 10000).toFixed(0) * item.productQuantity),
              0
            ),
            currency: currency_code,
            packageInfoList: packageInfoList?.map((pkg) => ({ ...pkg, price: getPriceWithMarkup((pkg.price / 10000), pricePercentage) * 10000 })),
            orderNo: esimOrderResult.payload.data.orderNo,
          })
        );

        if (saveResult.payload.success) {
          showSuccessToast("Payment & eSim Order Successful!");

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          showErrorToast("Failed to save payment data.");
        }

        // Step 3: Update UI
        dispatch(setPaymentStatus("success"));
        await dispatch(clearFromCart());
        dispatch(resetPaymentState());

      }
    } catch (error) {
      showErrorToast("Error processing payment.");
    } finally {
      setProcessing(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="p-3 border rounded" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
      >
        {processing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default PaymentButtons;