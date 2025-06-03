import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

import {
    setAddToCartOpen,
    setSelectedProduct,
    removeFavouritePlan,
    upsertFavouritePlan
} from "../../features";

const Sidebar = ({ selectedEsim, onClose }) => {
    const dispatch = useDispatch();
    const { pricePercentage } = useSelector((state) => state.settings);
    const { favouritePlans } = useSelector((state) => state.favouritePlans);

    const handleAddToCart = (product) => {
        dispatch(setSelectedProduct(product));
        dispatch(setAddToCartOpen(true));
    };

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

    if (!selectedEsim) return null;

    const isFavourite = favouritePlans.some((item) => item.packageCode === selectedEsim.packageCode);

    return (
        <div className="fixed inset-0 flex items-center justify-end z-50">
            <div className="bg-gray-900 opacity-50 absolute inset-0 cursor-pointer" onClick={onClose}></div>

            <div className="relative w-[52rem] bg-white shadow-2xl h-full p-6 rounded-l-2xl transform transition-transform duration-300 ease-in-out animate-slide-in">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">eSIM Details</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-500 transition duration-300">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <p><strong>Name:</strong> {selectedEsim.name || "N/A"}</p>
                    <p><strong>Package Code:</strong> {selectedEsim.packageCode || "N/A"}</p>
                    <p><strong>Speed:</strong> {selectedEsim.speed || "N/A"}</p>
                    <p><strong>IP Export:</strong> {selectedEsim.ipExport || "N/A"}</p>
                    <p><strong>Data:</strong> {getFormattedVolume(selectedEsim.volume)}</p>
                    <p><strong>Duration:</strong> {selectedEsim.duration} {selectedEsim.durationUnit}</p>
                    <p><strong>Top up type:</strong> {selectedEsim ? (<>Data is reloadable for the <br />same area within the validity time.</>) : "N/A"}</p>
                    <p><strong>CurrencyCode:</strong> {selectedEsim.currencyCode || "N/A"}</p>
                    <p><strong>Location Name:</strong>
                        {selectedEsim.locationNetworkList?.map(loc => loc.locationName).join(" ,") || "N/A"}
                    </p>
                    <p><strong>Price:</strong> ${getPriceWithMarkup(selectedEsim.price, pricePercentage)}</p>

                </div>
                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(selectedEsim);
                        }}
                        className="text-white px-3 py-1 rounded-md"
                        style={{ backgroundColor: "var(--primary-color)" }}
                    >
                        Add To Cart
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(selectedEsim);
                        }}
                        className={`text-lg ${isFavourite ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                    >
                        <FontAwesomeIcon icon={faHeart} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Sidebar;
