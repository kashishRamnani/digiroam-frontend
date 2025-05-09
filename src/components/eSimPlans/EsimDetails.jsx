import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const Sidebar = ({ selectedEsim, onClose }) => {
    const { pricePercentage } = useSelector((state) => state.settings);
    if (!selectedEsim) return null;

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
                    <p>Name: <strong>{selectedEsim?.name ?? "N/A"}</strong></p>
                    <p>Code: <strong>{selectedEsim?.packageCode ?? "N/A"}</strong></p>
                    <p>Data: <strong>{selectedEsim ? getFormattedVolume(selectedEsim.volume) : "N/A"}</strong></p>
                    <p>Duration: <strong>{selectedEsim ? `${selectedEsim.duration} ${selectedEsim.durationUnit}` : "N/A"}</strong></p>
                    <p>Price: <strong>${selectedEsim ? getPriceWithMarkup(selectedEsim.price, pricePercentage) : "N/A"}</strong></p>
                    <p>Region Type: <strong>{selectedEsim ? selectedEsim?.location.split(',').length >= 2 ? "Multiple" : "Single" : "N/A"}</strong></p>
                    <p>Region{selectedEsim?.location.split(',').length >= 2 && 's'}: <strong>{selectedEsim ? selectedEsim?.locationNetworkList?.map(loc => loc.locationName).join(", ") : "N/A"}</strong></p>
                    <p>Speed: <strong>{selectedEsim?.speed ?? "N/A"}</strong></p>
                    <p>Top up type: <strong>{selectedEsim ? "Data is reloadable for the same area within the validity time." : "N/A"}</strong></p>
                </div>

            </div>

        </div>
    );
};

export default Sidebar;
