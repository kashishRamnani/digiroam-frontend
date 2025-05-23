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
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
  transactions,
} from "../../features";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import calculateNetAmount from "../../utils/helpers/calculateNetAmount";
import { faCcPaypal, faCcMastercard } from "@fortawesome/free-brands-svg-icons";

const stripePromise = loadStripe("pk_test_51PtX1yP5I2dh2w2olaE2SXdVYWT056atlVJ3jVZKliMu6GQUa17xzEQHTrELjjJRWal7JwTySuFZLdeNJ7SGwrX700LCXKN0LP");

const WalletModel = ({ isVisible, onClose }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [amountError, setAmountError] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const dispatch = useDispatch();
  const { stripeClientSecret, loading, error } = useSelector((state) => state.wallet);

  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isVisible) {
      setAmount("");
      setPaymentMethod(null);
      setShowPaymentOptions(false);
    }
  }, [isVisible]);

  const handleStripeClick = async () => {
    setPaymentMethod("stripe");
    await dispatch(stripePayment({ amount: Number(amount), currency: "USD" }));
  };

  const handlePayPalClick = () => {
    setPaymentMethod("paypal");
  };

  const generatePayPalOrderIdHandler = async () => {
    if (!amount || Number(amount) <= 0) return "";
    try {
      const result = await dispatch(
        paypalGenerateOrder({ amount: Number(amount), currency: "USD" })
      ).unwrap();
      return result?.orderId || "";
    } catch {
      return "";
    }
  };

  const onApprovePayPalHandler = async (data) => {
    try {
      const result = await dispatch(
        paypalCaptureOrder({ orderId: data.orderID })
      ).unwrap();
      if (result?.transactionId) {
        await handlePaymentSuccess(result.transactionId);
        dispatch(transactions())
        onClose();
      }
    } catch { }
  };

  const handlePaymentSuccess = async (transactionId) => {
    try {
      await dispatch(addFunds({ transactionId, amount, currency: "USD" }));
      showSuccessToast("Funds added successfully to your wallet!");
    } catch {
      showErrorToast("Failed to add funds to wallet.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Fund Your Wallet
        </h3>

        {!showPaymentOptions ? (
          <>
            <label className="ms-1 font-semibold" htmlFor="amount">Amount</label>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter Amount (min $5.00)"
                value={amount}
                id="amount"
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm"
              />
              <button
                onClick={() => {
                  if (!amount || Number(amount) < 5) {
                    return setAmountError("Amount must be at least $5");
                  } else if (Number(amount) >= 10001) {
                    return setAmountError("Amount must not exceed $10,000");
                  }
                  setAmountError("");
                  setShowPaymentOptions(true);
                }}
                disabled={Number(amount) < 5}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#ee643a] transition disabled:bg-[#ee643a8e] disabled:cursor-not-allowed"
              >
                Proceed
              </button>
            </div>
            {amountError && (
              <p className="text-red-600 text-sm mb-4 font-medium">{amountError}</p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowPaymentOptions(false)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
              <div className="text-lg font-semibold">
                Add <span className="text-blue-600">${parseFloat(amount).toFixed(2)}</span> to wallet
              </div>
            </div>

            {/* Receipt Summary */}
            {amount && (() => {
              const { fee, net } = calculateNetAmount(Number(amount));
              return (
                <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-sm text-gray-700">
                  <h4 className="text-base font-semibold mb-3 text-gray-800 text-center">Transaction Summary</h4>
                  <div className="flex justify-between mb-2">
                    <span>Deposit Amount</span>
                    <span className="font-medium text-gray-900">${Number(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Processing Fee</span>
                    <span className="text-red-500 font-medium">-${fee}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between text-base font-semibold">
                    <span>Wallet Credit</span>
                    <span className="text-green-600">${net}</span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    💡 Fees are ~3.5% + $0.30, charged by secure gateways (Stripe/PayPal).
                  </p>
                </div>
              );
            })()}

            {/* Payment Options */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handlePayPalClick}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-600 text-white text-base font-medium"
              >
                <FontAwesomeIcon icon={faCcPaypal} size="lg" />
                <span>PayPal</span>
              </button>
              <button
                onClick={handleStripeClick}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium"
              >
                <FontAwesomeIcon icon={faCcMastercard} size="lg" />
                <span>Credit Card</span>
              </button>
            </div>

            {/* PayPal */}
            {paymentMethod === "paypal" && (
              <PayPalScriptProvider options={{ "client-id": "ARQlumdLfObf_DPA-MuD7_hqMgREgD7YyTiUBEjKGrWbiW0ot9KpvRmlx8WrL9rmfGSi4-rLmsO8JOyW" }}>
                <PayPalButtons
                  createOrder={generatePayPalOrderIdHandler}
                  onApprove={onApprovePayPalHandler}
                  style={{ layout: "horizontal", shape: "pill", color: "gold", tagline: false }}
                />
              </PayPalScriptProvider>
            )}

            {/* Stripe */}
            {paymentMethod === "stripe" && stripeClientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                <StripeCheckoutForm
                  clientSecret={stripeClientSecret}
                  onClose={onClose}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}

            {error && <p className="mt-6 text-center text-red-600 font-medium">{error}</p>}
          </>
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
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });
    setPaymentLoading(false);

    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      setPaymentSuccess(true);
      await onPaymentSuccess(paymentIntent.id);
      setTimeout(() => onClose(), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="border border-gray-300 rounded-lg px-3 py-2 mb-4 shadow-sm bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#4B5563",
                "::placeholder": { color: "#9CA3AF" },
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              },
              invalid: { color: "#EF4444" },
            },
          }}
        />
      </div>
      {paymentError && <p className="text-center text-red-500 mb-4 font-semibold">{paymentError}</p>}
      {paymentSuccess && <p className="text-center text-green-600 mb-4 font-semibold">Payment succeeded!</p>}
      <button
        type="submit"
        disabled={!stripe || paymentLoading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-semibold"
      >
        {paymentLoading ? "Processing..." : "Confirm"}
      </button>
    </form>
  );
};

export default WalletModel;
