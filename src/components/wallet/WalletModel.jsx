import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcMastercard, faPaypal } from "@fortawesome/free-brands-svg-icons";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import {
  stripePayment,
  paypalGenerateOrder,
  paypalCaptureOrder,
  addFunds,
  resetPaymentState,

} from "../../features";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
const stripePromise = loadStripe(
  "pk_test_51PtX1yP5I2dh2w2olaE2SXdVYWT056atlVJ3jVZKliMu6GQUa17xzEQHTrELjjJRWal7JwTySuFZLdeNJ7SGwrX700LCXKN0LP"
);

const WalletModel = ({ isVisible, onClose }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [amountError, setAmountError] = useState("");


  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isVisible) {
      setAmount("");
      setPaymentMethod(null);
    }
  }, [isVisible]);
  const { stripeClientSecret, loading, error } = useSelector(
    (state) => state.wallet
  );

  if (!isVisible) return null;

  const handleStripeClick = async () => {
    if (!amount || Number(amount) <= 0) {
      setAmountError("Please enter a your amount.");
      return;
    }
    setAmountError("");
    setPaymentMethod("stripe");
    await dispatch(
      stripePayment({
        amount: Number(amount),
        currency: "USD",
      })
    );
  };

  const handlePayPalClick = async () => {
    if (!amount || Number(amount) <= 0) {
      setAmountError("Please enter a your amount.");
      return;
    }
    setAmountError("");
    setPaymentMethod("paypal");
  };


  const generatePayPalOrderIdHandler = async () => {
    if (!amount || Number(amount) <= 0) {
      return "";
    }
    try {
      const result = await dispatch(
        paypalGenerateOrder({
          amount: Number(amount),
          currency: "USD",
        })
      ).unwrap();

      if (!result || !result.orderId) {
        console.error("PayPal Order ID is missing:", result);
        return "";
      }
      return result.orderId;
    } catch (error) {
      console.error("PayPal Order Generation Error:", error);
      return "";
    }
  };

  const onApprovePayPalHandler = async (data) => {
    try {
      const result = await dispatch(
        paypalCaptureOrder({ orderId: data.orderID })
      ).unwrap();

      if (result && result.transactionId) {
        await handlePaymentSuccess(result.transactionId);
        onClose();
      }
    } catch (error) {
      console.error("PayPal Capture Error:", error);
    }
  };

  const handlePaymentSuccess = async (transactionId) => {
    try {
      await dispatch(addFunds({ transactionId, amount, currency: "USD" }));
      showSuccessToast("Funds added successfully to your wallet!");
    } catch (error) {
      showErrorToast("Failed to add funds to wallet.");
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Top Up Your Wallet
        </h2>

        <input
          type="number"
          placeholder="Enter Amount (USD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
          required
        />
         {amountError && (
          <p className="text-red-600 text-sm mb-4 font-medium">{amountError}</p>
        )}

       

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={handlePayPalClick}
            disabled={loading}
            className="flex items-center space-x-3 px-6 py-3 rounded-lg bg-blue-500 shadow-md hover:bg-blue-700   transition duration-300 text-lg font-semibold text-white"
          >
            <FontAwesomeIcon icon={faPaypal} size="2x" />
            <span>PayPal</span>
          </button>

          <button
            onClick={handleStripeClick}
            disabled={loading}
            className="flex items-center space-x-3 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-md transition duration-300 text-lg font-semibold text-white"
          >
            <FontAwesomeIcon icon={faCcMastercard} size="2x" />
            <span>Credit Card</span>
          </button>

        </div>

        {paymentMethod === "paypal" && (
          <PayPalScriptProvider
            options={{
              "client-id":
                "ARQlumdLfObf_DPA-MuD7_hqMgREgD7YyTiUBEjKGrWbiW0ot9KpvRmlx8WrL9rmfGSi4-rLmsO8JOyW",
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

        {paymentMethod === "stripe" && stripeClientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
            <StripeCheckoutForm
              clientSecret={stripeClientSecret}
              onClose={onClose}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>

        )}


        {error && (
          <p className="mt-6 text-center text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

const StripeCheckoutForm = ({ clientSecret, onClose, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentLoading(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    setPaymentLoading(false);

    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentSuccess(true);
      await onPaymentSuccess(paymentIntent.id);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "18px",
                color: "#4B5563",
                "::placeholder": { color: "#9CA3AF" },
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              },
              invalid: {
                color: "#EF4444",
              },
            },
          }}
        />
      </div>

      {paymentError && (
        <p className="text-center text-red-500 mb-4 font-semibold">
          {paymentError}
        </p>
      )}
      {paymentSuccess && (
        <p className="text-center text-green-600 mb-4 font-semibold">
          Payment succeeded!
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || paymentLoading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 text-xl font-semibold shadow-lg"
      >
        {paymentLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default WalletModel;
