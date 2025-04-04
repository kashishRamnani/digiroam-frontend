import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const Sidebar = ({ selectedEsim, onClose }) => {
    const { pricePercentage } = useSelector((state) => state.settings);
    if (!selectedEsim) return null;
    console.log(selectedEsim);

    return (
        <div className="fixed inset-0 flex items-center justify-end z-50">
          
            <div className="bg-gray-900 opacity-50 absolute inset-0 cursor-pointer" onClick={onClose}></div>

           
            <div className="relative w-[52rem] bg-white shadow-2xl h-full p-6 rounded-l-2xl transform transition-transform duration-300 ease-in-out animate-slide-in">
               
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl items-center font-bold text-gray-800">eSIM Details</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-500 transition duration-300">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <p><strong>Name:</strong> {selectedEsim.name || "N/A"}</p>
                    <p><strong>Package Code:</strong> {selectedEsim.packageCode || "N/A"}</p>
                    <p><strong>Slug:</strong> {selectedEsim.slug || "N/A"}</p>
                    <p><strong>Data Type:</strong> {selectedEsim.dataType || "N/A"}</p>
                    <p><strong>IP Export:</strong> {selectedEsim.ipExport || "N/A"}</p>
                    <p><strong>Data:</strong> {getFormattedVolume(selectedEsim.volume)}</p>
                    <p><strong>Duration:</strong> {selectedEsim.duration} {selectedEsim.durationUnit}</p>
                    <p><strong>Top up type:</strong> {selectedEsim.supportTopUpType || "N/A"}</p>
                    <p><strong>CurrencyCode:</strong> {selectedEsim.currencyCode|| "N/A"}</p>
                    <p><strong>Location:</strong> 
                        {selectedEsim.location || "N/A"}
                    </p>

                    <p><strong>Price:</strong> ${getPriceWithMarkup(selectedEsim.price, pricePercentage)}</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
