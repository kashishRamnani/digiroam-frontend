import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { stripeAddFunds,addFunds } from "../../features";

const stripePromise = loadStripe(
  "pk_test_51PtX1yP5I2dh2w2olaE2SXdVYWT056atlVJ3jVZKliMu6GQUa17xzEQHTrELjjJRWal7JwTySuFZLdeNJ7SGwrX700LCXKN0LP"
);

const WalletModel = ({ isVisible, onClose }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);

  const dispatch = useDispatch();
  const { stripeClientSecret, loading, error } = useSelector((state) => state.wallet);

  if (!isVisible) return null;

  const handleStripeClick = async () => {
    if (!amount || Number(amount) <= 0) {
    
      return;
    }
    setPaymentMethod("stripe");
    await dispatch(
      stripeAddFunds({
        amount: Number(amount),
        currency: "USD",
      })
    );
  };

  const handlePaymentSuccess = async (transactionId) =>{
   await dispatch( addFunds({transactionId,amount, currency:"USD"}))
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-8"
      role="dialog"
      aria-labelledby="wallet-model-title"
      aria-hidden={!isVisible}
    >
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full sm:w-3/4 lg:max-w-3xl ml-24 lg:left-[20%] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="wallet-model-title"
            className="text-lg sm:text-xl font-semibold"
          >
            WALLET
          </h2>
          <button
            onClick={onClose}
            aria-label="Close wallet modal"
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <input
          type="number"
          placeholder="Enter Your Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4 bg-white"
          min="0"
          step="0.01"
        />

        <button
          onClick={handleStripeClick}
          className="flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faCcMastercard} className="mr-2" />
          Credit Card
        </button>

        {paymentMethod === "stripe" && stripeClientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
            <StripeCheckoutForm clientSecret={stripeClientSecret} onClose={onClose} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
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

    if (!stripe || !elements) {
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    setPaymentLoading(false);

    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentSuccess(true);
       onPaymentSuccess(paymentIntent.id); 
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="border p-3 rounded mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      {paymentError && <p className="text-red-500 mb-2">{paymentError}</p>}
      {paymentSuccess && <p className="text-green-600 mb-2">Payment succeeded!</p>}

      <button
        type="submit"
        disabled={!stripe || paymentLoading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300"
      >
        {paymentLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default WalletModel;
