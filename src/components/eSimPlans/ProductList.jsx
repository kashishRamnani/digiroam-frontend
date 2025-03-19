import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const ProductList = ({ items }) => {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage } = useSelector((state) => state.plans);
  const { pricePercentage } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(retrieveSettings());
  }, [dispatch]);

  

  const handlePageChange = ({ selected }) => {
    dispatch(setCurrentPage(selected + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
    dispatch(setSelectedProduct(product));
    dispatch(setAddToCartOpen(true));
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Per GB
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((product) => (
              <tr key={product.packageCode}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
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
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  ${(
                    parseFloat(getPriceWithMarkup(product.price, pricePercentage)) /
                    (product.volume / (1024 * 1024 * 1024))
                  ).toFixed(2)}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="text-white px-3 py-1 rounded-md"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                  </div>
                </td>
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
    </div>
  );
};

export default ProductList;
