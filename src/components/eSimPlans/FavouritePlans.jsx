import React from "react";
import ProductList from "./ProductList";
import { useSelector } from "react-redux";

const FavouriteList = () => {
  const { favouritePlans } = useSelector((state) => state.favouritePlans);

  return (
    <div>
      {favouritePlans.length > 0 ? (
        <ProductList items={favouritePlans} noAction={false} />
      ) : (
        <p>No favourite plans added yet.</p>
      )}
    </div>
  );
};

export default FavouriteList;
