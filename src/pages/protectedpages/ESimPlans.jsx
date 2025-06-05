import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  retrieveSettings,
  setBuyNow,
  setCartOpen,
  setSelectedProduct,
} from "../../features";
import {
  ProductList,
  CartModal,
  AddToCartModal,
  Loader,
  FilterFavPlans,
  BuyNowModal,
} from "../../components";
import DashboardLayout from "../../layouts/DashboardLayout";
import FilterPlans from "../../components/eSimPlans/FilterPlans";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import FavouritePlans from "../../components/eSimPlans/FavouritePlans";

const ESimPlans = () => {
  const dispatch = useDispatch();
  const filterRef = useRef();
  const cart = useSelector((state) => state.cart.items);
  const { isLoading, items = [] } = useSelector((state) => state.plans);
  const { pricePercentage } = useSelector((state) => state.settings);
  const { favouritePlans = [] } = useSelector((state) => state.favouritePlans);

  const [filteredPlans, setFilteredPlans] = useState([]);
  const [filteredFavPlans, setFilteredFavPlans] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [purchasePending] = useState(() =>
    JSON.parse(localStorage.getItem("purchasePending") || "null")
  );

  useEffect(() => {
    dispatch(retrieveSettings());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPlans(items);
    if (filterRef.current?.applyInitialFilter) {
      filterRef.current.applyInitialFilter();
    }
  }, [items]);

  useEffect(() => {
    setFilteredFavPlans(favouritePlans);
  }, [favouritePlans]);



  useEffect(() => {
    if (purchasePending) {
      dispatch(setSelectedProduct(purchasePending));
      dispatch(setBuyNow(true));
    }
  }, []);

  const handleFilter = (filteredItems) => {
    setFilteredPlans(filteredItems);
  };

  const handleFavFilter = (filteredFavItems) => {
    setFilteredFavPlans(filteredFavItems);
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
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Cart ({cart.length})</span>
          </button>

          <button
            onClick={() => setShowFavourites(!showFavourites)}
            className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            {!showFavourites ? (
              <span className="mx-4">
                <FontAwesomeIcon icon={faHeart} /> Show Favourite Plans ({favouritePlans.length})
              </span>
            ) : (
              <span className="mx-4">Show All Plans ({items.length})</span>
            )}
          </button>
        </div>

        {!showFavourites ? (
          <FilterPlans
            ref={filterRef}
            plans={items}
            pricePercentage={pricePercentage}
            onFilter={handleFilter}
            value={purchasePending?.name ?? ""}
          />
        ) : (
          <FilterFavPlans
        
            favouritePlans={filteredFavPlans}
            pricePercentage={pricePercentage}
            onFilter={handleFavFilter}
          
          />
        )}

        {!showFavourites ? (
          <ProductList items={filteredPlans} />
        ) : (
          <FavouritePlans
            pricePercentage={pricePercentage}
            favouritePlans={filteredFavPlans}
          />
        )}

        <AddToCartModal />
        <CartModal />
        <BuyNowModal />
      </div>
    </DashboardLayout>
  );
};

export default ESimPlans;
