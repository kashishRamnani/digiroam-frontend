import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { retrieveSettings, setCartOpen } from "../../features";
import {
  ProductList,
  CartModal,
  AddToCartModal,
  Loader,
  FilterFavPlans
} from "../../components";
import DashboardLayout from "../../layouts/DashboardLayout";
import FilterPlans from "../../components/eSimPlans/FilterPlans";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import FavouritePlans from "../../components/eSimPlans/FavouritePlans";

const ESimPlans = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { isLoading, items = [] } = useSelector((state) => state.plans);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const { favouritePlans = [] } = useSelector((state) => state.favouritePlans);
  const [filteredFavPlans, setFilteredFavPlans] = useState([]);

  useEffect(() => {
    dispatch(retrieveSettings());
    setFilteredPlans(items);
  }, [dispatch, items]);

  const handleFilter = (filteredItems) => {
    setFilteredPlans(filteredItems);
  };
  useEffect(() => {
    setFilteredFavPlans(favouritePlans);
  }, [favouritePlans]);

  const handleFavFilter = (filteredItems) => {
    setFilteredFavPlans(filteredItems);
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
            className="flex items-center  space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            {!showFavourites && (
              <span className="mx-4">
                <FontAwesomeIcon icon={faHeart} /> Show Favourite Plans ({favouritePlans.length})
              </span>
            )}

            {!!showFavourites && (
              <span className="mx-4">
                Show All Plans ({items.length})
              </span>
            )}
          </button>
        </div>

        {/* <FilterPlans plans={items} pricePercentage={pricePercentage} onFilter={handleFilter} />
         <FilterFavPlans
            favouritePlans={filteredFavPlans}
            pricePercentage={pricePercentage}
            onFilter={handleFilter}
          /> */}
        {!showFavourites ? (
          <FilterPlans
            plans={items}
            pricePercentage={pricePercentage}
            onFilter={handleFilter}
          />
        ) : (
          <FilterFavPlans
            favouritePlans={favouritePlans}
            pricePercentage={pricePercentage}
            onFilter={handleFavFilter}
          />

        )}
        {!!showFavourites ? (<FavouritePlans pricePercentage={pricePercentage} favouritePlans={filteredFavPlans} />
        ) : (<ProductList items={filteredPlans} />)}
        <AddToCartModal />
        <CartModal />
      </div>
    </DashboardLayout>
  );
};

export default ESimPlans;
