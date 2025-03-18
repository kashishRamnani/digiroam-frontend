import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartOpen,
  removeFromCart,
  fetchCartFromServer,
  retrieveSettings,
} from "../../features";
import PaymentButtons from "../paymentButtons/PaymentButtons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";

const CartModal = () => {
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchCartFromServer());
    dispatch(retrieveSettings());
  }, [dispatch]);

  const handleRemoveFromCart = async (item) => {
    try {
      const result = await dispatch(removeFromCart({ productId: item.productId }));
      if (removeFromCart.fulfilled.match(result)) {
        await dispatch(fetchCartFromServer());
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  if (!isCartOpen) return null;
  const total = items.reduce(
    (sum, item) => sum + getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-8"
      role="dialog"
      aria-labelledby="cart-modal-title"
      aria-hidden={!isCartOpen}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl ml-8">
        <div className="flex justify-between items-center mb-4">
          <h2 id="cart-modal-title" className="text-xl font-semibold">
            Cart Details
          </h2>
          <button
            onClick={() => dispatch(setCartOpen(false))}
            aria-label="Close cart modal"
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Your cart is empty.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Unit Price</th>
                  <th className="py-2 text-left">Quantity</th>
                  <th className="py-2 text-left">Total Price</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2">{item.productName}</td>
                    <td className="py-2">${getPriceWithMarkup(item.productPrice, pricePercentage)}</td>
                    <td className="py-2">{item.productQuantity}</td>
                    <td className="py-2">
                      ${(getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity).toFixed(2)}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleRemoveFromCart(item)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.productName} from cart`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-gray-800 border-2 rounded-md p-2"
              aria-label="Email for checkout"
            />
            <div className="text-right">
              <div className="text-sm text-gray-500">Total:</div>
              <div className="text-xl font-bold">${total.toFixed(2)}</div>
            </div>
          </div>

          <PaymentButtons />
        </div>
      </div>
    </div>
  );
};

export default CartModal;
