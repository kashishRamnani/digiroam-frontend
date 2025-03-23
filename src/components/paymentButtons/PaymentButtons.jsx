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
import { resetPaymentState, retrieveSettings, setPaymentStatus } from "../../features";
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

const stripePromise = loadStripe("pk_test_51PtX1yP5I2dh2w2olaE2SXdVYWT056atlVJ3jVZKliMu6GQUa17xzEQHTrELjjJRWal7JwTySuFZLdeNJ7SGwrX700LCXKN0LP");

const PaymentButtons = () => {
  const dispatch = useDispatch();
  const { stripeClientSecret, loading, error, paymentStatus, paypalOrderId } =
    useSelector((state) => state.payment);
  const { items } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    dispatch(retrieveSettings());
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
      console.log(items);
      const result = await dispatch(
        generatePayPalOrderId({
          amount: items.reduce(
            (total, item) => total + getPriceWithMarkup(item.productPrice * 10000, pricePercentage) * item.productQuantity,
            0
          ),
          currency: "USD",
          items: items.map((item) => ({
            name: item.productName,
            price: getPriceWithMarkup(item.productPrice * 10000, pricePercentage),
            quantity: item.productQuantity,
          })),
        })
      );


      if (result.error) {
        console.error("PayPal Order Generation Failed:", result.error);
        throw new Error(result.error.message ?? "Unknown error");
      }

      if (!result.payload || !result.payload.orderId) {
        console.error("PayPal Order ID is missing:", result.payload);
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
        showErrorToast("eSim Order Failed: " + esimOrderResult.payload?.message);
        return;
      }

      amount = items.reduce(
        (total, item) => total + (Number(getPriceWithMarkup(item.productPrice * 10000, pricePercentage)).toFixed(0) * item.productQuantity),
        0
      );

      amount = String(amount);

      // 🔹 Step 4: Save Payment Data
      const saveResult = await dispatch(
        savePaymentData({
          transactionId,
          amount,
          currency: currency_code,
          payer,
          packageInfoList: packageInfoList?.map((pkg) => ({ ...pkg, price: getPriceWithMarkup(pkg.price, pricePercentage) })),
          orderNo: esimOrderResult.payload.data.orderNo
        })
      );

      if (saveResult.payload.success) {
        showSuccessToast("Payment & eSim Order Successful!");

        // setTimeout(() => {
        //   window.location.href = '/dashboard';
        // }, 1000);
      } else {
        console.log("Failed to save payment", error);
        showErrorToast("Failed to save payment data");
      }
    } catch (error) {
      showErrorToast("Error capturing PayPal payment");
    }
  };

  return (
    <>
      {items && items.length > 0 && (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Choose Payment Method
          </h2>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handlePayPalClick}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPaypal} className="mr-2" />
              PayPal
            </button>
            <button
              onClick={handleStripeClick}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCcMastercard} className="mr-2" />
              Credit Card
            </button>
          </div>

          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {paymentMethod === "paypal" && (
            <PayPalScriptProvider options={{ "client-id": "ARQlumdLfObf_DPA-MuD7_hqMgREgD7YyTiUBEjKGrWbiW0ot9KpvRmlx8WrL9rmfGSi4-rLmsO8JOyW" }}>
              <PayPalButtons
                createOrder={generatePayPalOrderIdHandler}
                onApprove={onApprovePayPalHandler}
                style={{ layout: "horizontal" }}
              />
            </PayPalScriptProvider>
          )}

          {paymentMethod === "stripe" && stripeClientSecret && (
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm clientSecret={stripeClientSecret} items={items} pricePercentage={pricePercentage} />
            </Elements>
          )}

          {paymentStatus === "success" && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              Payment successful! Thank you for your purchase.
            </div>
          )}
        </div>
      )}
    </>
  );
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
          showErrorToast("eSim Order Failed: " + esimOrderResult.payload?.message);
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
            packageInfoList: packageInfoList?.map((pkg) => ({ ...pkg, price: getPriceWithMarkup(pkg.price, pricePercentage) })),
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
        showSuccessToast("Payment Successful!");
      }
    } catch (error) {
      console.error("Error handling Stripe payment:", error);
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