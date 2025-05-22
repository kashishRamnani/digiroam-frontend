import { useDispatch, useSelector } from "react-redux";
import { removeFavouritePlan, retrieveFavouritePlans, retrieveSettings, setAddToCartOpen, setCurrentPage, setSelectedProduct, upsertFavouritePlan } from "../../features";
import { useEffect, useState } from "react";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../common/Pagination";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Loader from "../common/Loader";

const FavouriteList = ({favouritePlans, pricePercentage }) => {
  const dispatch = useDispatch();
  const {  loading } = useSelector((state) => state.favouritePlans);
  const { currentPage, itemsPerPage } = useSelector((state) => state.plans);

  const [sortOrder, setSortOrder] = useState("price");
  const [selectedEsim, setSelectedEsim] = useState(null);

  useEffect(() => {
    dispatch(retrieveFavouritePlans());
  }, []);

  const handlePageChange = ({ selected }) => {
    dispatch(setCurrentPage(selected + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
    dispatch(setSelectedProduct(product));
    dispatch(setAddToCartOpen(true));
  };

  const handleRowClick = (product) => setSelectedEsim(product);

  const totalPages = Math.ceil(favouritePlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = favouritePlans.slice(startIndex, endIndex);

  const sortedItems = [...currentItems].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  const handleSortChange = (e) => setSortOrder(e.target.value);

  const toggleFavorite = (product) => {
    const isAlreadyFavourite = favouritePlans.some(
      (item) => item.packageCode === product.packageCode
    );

    if (isAlreadyFavourite) {
      dispatch(removeFavouritePlan(product.packageCode));
    } else {
      dispatch(upsertFavouritePlan({ packageCode: product.packageCode, slug: product.slug }));
    }
  };

  return (
  
      <div className="table-container ">
       <table className="min-w-full bg-white table-auto max-w-full">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {favouritePlans.length >= 1
              ? sortedItems.map((product) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">{getFormattedVolume(product.volume)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.duration} {product.durationUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                        className={`text-lg ${favouritePlans.find((item) => item.packageCode === product.packageCode)
                          ? "text-red-500"
                          : "text-gray-400"
                          } hover:text-red-500`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              : <tr className="cursor-pointer hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">You have no favorite plans yet. Please try adding some.</td>
              </tr>}
          </tbody>
        </table>
      
      {favouritePlans.length > 0 && (
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

export default FavouriteList;
