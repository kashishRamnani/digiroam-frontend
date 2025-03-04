import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCartOpen } from "../../features";
import {
  ProductFilters,
  ProductList,
  CartModal,
  AddToCartModal,
  Loader,
} from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faDownload } from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "../../layouts/DashboardLayout";

const ESimPlans = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { isLoading } = useSelector((state) => state.plans);
  const total = cart.reduce(
    (sum, item) => sum + (item.price / 10000) * item.quantity,
    0
  );

  return (
    <DashboardLayout>
      {isLoading && <Loader />}
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
              style={{ backgroundColor: "var(--secondary-color)" }}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>Cart ({cart.length})</span>
            </button>
          </div>
        </div>

        <ProductFilters />
        <ProductList />
        <AddToCartModal />
        <CartModal />
      </div>
    </DashboardLayout>
  );
};

export default ESimPlans;
