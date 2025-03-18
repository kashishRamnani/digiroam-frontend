import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { retrieveSettings, setCartOpen } from "../../features";
import { ProductList, CartModal, AddToCartModal, Loader } from "../../components";
import DashboardLayout from "../../layouts/DashboardLayout";
import FilterPlans from "../../components/eSimPlans/FilterPlans";

const ESimPlans = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { isLoading, items = [] } = useSelector((state) => state.plans);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    dispatch(retrieveSettings());
    setFilteredPlans(items);
  }, [items]);

  const handleFilter = (filteredItems) => {
    setFilteredPlans(filteredItems);
  };

  return (
    <DashboardLayout>
      {isLoading && <Loader />}
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => dispatch(setCartOpen(true))}
            className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            Cart ({cart.length})
          </button>
        </div>

        <FilterPlans plans={items} pricePercentage={pricePercentage} onFilter={handleFilter} />
        <ProductList items={filteredPlans} />
        <AddToCartModal />
        <CartModal />
      </div>
    </DashboardLayout>
  );
};

export default ESimPlans;
