import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartFromServer, retrieveSettings, setAddToCartOpen } from "../../features";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const AddToCartModal = () => {
  const dispatch = useDispatch();
  const { isAddToCartOpen, selectedProduct } = useSelector((state) => state.cart);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    dispatch(setAddToCartOpen(false));
    setQuantity(1);
  };


  const handleAddToCart = async () => {
    try {
      const result = await dispatch(addToCart({ product: selectedProduct, quantity }));

      if (addToCart.fulfilled.match(result)) {
        await dispatch(fetchCartFromServer());
      }

      handleClose();
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  if (!isAddToCartOpen || !selectedProduct) return null;

  const total = (getPriceWithMarkup(selectedProduct.price, pricePercentage) * quantity).toFixed(2);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="add-to-cart-title"
      aria-hidden={!isAddToCartOpen}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 id="add-to-cart-title" className="text-xl font-semibold">
            Add to cart
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="text-gray-500 text-4xl hover:text-gray-700"
          >
            ×
          </button>
        </div>

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
            <span>${getPriceWithMarkup(selectedProduct.price, pricePercentage)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Qty</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="px-3 py-1 border-r"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center bg-white text-gray-800 p-1"
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                aria-label="Increase quantity"
                className="px-3 py-1 border-l"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">${total}</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-6 py-2 px-4 text-white rounded-md bg-primary hover:bg-primary-dark"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
