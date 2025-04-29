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
import  RemoveConfirmationModal  from '../common/RemoveConfirmation';

const CartModal = () => {
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [email, setEmail] = useState("");
  const [showConfirm,setShowConfirm] = useState(false);
  const [itemToRemove,setItemToRemove] = useState(null);
  
  useEffect(() => {
    dispatch(fetchCartFromServer());
    dispatch(retrieveSettings());
  }, [dispatch]);

  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowConfirm(true);
  };
  
  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      await handleRemoveFromCart(itemToRemove);
      setItemToRemove(null);
      setShowConfirm(false);
    }
  };
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
    (sum, item) =>
      sum + getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-8"
      role="dialog"
      aria-labelledby="cart-modal-title"
      aria-hidden={!isCartOpen}
    >
      <div className="bg-white rounded-lg p-4  sm:p-6 w-full sm:w-3/4 lg:max-w-3xl ml-24 lg:left-[20%]shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 id="cart-modal-title" className="text-lg sm:text-xl font-semibold">Cart Details</h2>
          <button
            onClick={() => dispatch(setCartOpen(false))}
            aria-label="Close cart modal"
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-4">Your cart is empty.</div>
        ) : (
          <div className="overflow-x-auto max-h-40 border rounded-md">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="border-b">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left hidden sm:table-cell">Price</th>
                  <th className="py-2 px-3 text-left">Qty</th>
                  <th className="py-2 px-3 text-left hidden sm:table-cell">Total</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-1 px-3 whitespace-nowrap">{item.productName}</td>
                    <td className="py-1 px-3 hidden sm:table-cell">
                      ${getPriceWithMarkup(item.productPrice, pricePercentage)}
                    </td>
                    <td className="py-1 px-3">{item.productQuantity}</td>
                    <td className="py-1 px-3 hidden sm:table-cell">
                      ${(getPriceWithMarkup(item.productPrice, pricePercentage) * item.productQuantity).toFixed(2)}
                    </td>
                    <td className="py-1 px-3">
                      <button
                       onClick={() => handleRemoveClick(item)}
                       
                        className="text-red-500 hover:text-red-700 text-xs"
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

        <div className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-gray-800 border rounded-md p-2 text-sm"
            aria-label="Email for checkout"
          />

          <div className="flex justify-between text-sm">
            <span className="font-medium">Total:</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>

          <PaymentButtons />
          <RemoveConfirmationModal
  isVisible={showConfirm}
  onCancel={() => setShowConfirm(false)}
  onConfirm={confirmRemoveItem}
/>

        </div>
      </div>
    </div>
  );
};

export default CartModal;
