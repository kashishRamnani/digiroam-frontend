import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./EsimDetails";
import {
  setAddToCartOpen,
  setSelectedProduct,
  setCurrentPage,
  retrieveSettings,
} from "../../features";
import { fetchProducts } from "../../features/products/productSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";

import Pagination from "../common/Pagination";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
const ProductList = ({ items, locationCode = "", noAction }) => {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage } = useSelector((state) => state.plans);
  const { pricePercentage } = useSelector((state) => state.settings);
  const [sortOrder, setSortOrder] = useState("price");
  const [selectedEsim, setSelectedEsim] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ locationCode }));
    dispatch(retrieveSettings());
  }, [dispatch, locationCode]);


  const handlePageChange = ({ selected }) => {
    dispatch(setCurrentPage(selected + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
    dispatch(setSelectedProduct(product));
    dispatch(setAddToCartOpen(true));
  };

  const handleRowClick = (product) => {
    setSelectedEsim(product);
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const sortProducts = (order) => {
    if (order === "asc") {
      return [...currentItems].sort((a, b) => a.price - b.price);
    } else {
      return [...currentItems].sort((a, b) => b.price - a.price);
    }
  };

  const sortedItems = sortProducts(sortOrder);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">

          <select onChange={handleSortChange} value={sortOrder} className="p-2 border rounded-md">
            <option value=""> Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>

          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              {!noAction && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((product) => (
              <tr
                key={product.packageCode}
                onClick={() => handleRowClick(product)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${getPriceWithMarkup(product.price, pricePercentage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getFormattedVolume(product.volume)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.duration} {product.durationUnit}
                </td>
                {!noAction && <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="text-white px-3 py-1 rounded-md"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > 0 && (
        <div className="mt-4">
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage - 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Sidebar for eSIM Details */}
      {selectedEsim && <Sidebar selectedEsim={selectedEsim} onClose={() => setSelectedEsim(null)} />}
    </div>
  );
};

export default ProductList;



