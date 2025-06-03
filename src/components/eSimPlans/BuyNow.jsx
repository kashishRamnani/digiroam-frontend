import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBuyNow } from "../../features";
import PaymentButtons from "../paymentButtons/PaymentButtons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const BuyNowModal = () => {
  const dispatch = useDispatch();
  const { isBuyNow, selectedProduct } = useSelector((state) => state.cart); 
   
  const { pricePercentage } = useSelector((state) => state.settings);
 

  if (!isBuyNow || !selectedProduct) return null;

  const handleClose = () => {
    dispatch(setBuyNow(false));
    
  };

  const total = (getPriceWithMarkup(selectedProduct.price, pricePercentage));


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
          <span>${getPriceWithMarkup(selectedProduct.price, pricePercentage)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold">${total}</span>
      </div>

      {/* Make sure PaymentButtons is inside the white box container */}
      <div className="mt-6">
        <PaymentButtons label="Buy Now" />
      </div>
    </div>
  </div>
);

};

export default BuyNowModal;
