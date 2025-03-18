import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const FilterPlans = ({ plans = [], pricePercentage = 0, onFilter }) => {
    const [filterText, setFilterText] = useState("");
    const [selectedField, setSelectedField] = useState("all");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFilterText(value);
        applyFilter(value, selectedField);
    };

    const handleFieldChange = (e) => {
        const field = e.target.value;
        setSelectedField(field);
        applyFilter(filterText, field);
    };

    const applyFilter = (query, field) => {
        if (!query) {
            onFilter(plans);
            return;
        }

        const lowerQuery = query.toLowerCase();

        const filteredResults = plans.filter((product) => {
            const formattedPrice = getPriceWithMarkup(product.price, pricePercentage).toLowerCase();
            const formattedVolume = getFormattedVolume(product.volume).toLowerCase();
            const formattedDuration = `${product.duration} ${product.durationUnit}`.toLowerCase();

            if (field === "all") {
                return (
                    product.name.toLowerCase().includes(lowerQuery) ||
                    formattedPrice.includes(lowerQuery) ||
                    formattedVolume.includes(lowerQuery) ||
                    formattedDuration.includes(lowerQuery)
                );
            }

            switch (field) {
                case "name":
                    return product.name.toLowerCase().includes(lowerQuery);
                case "price":
                    return formattedPrice.includes(lowerQuery);
                case "data":
                    return formattedVolume.includes(lowerQuery);
                case "duration":
                    return formattedDuration.includes(lowerQuery);
                default:
                    return false;
            }
        });

        onFilter(filteredResults);
    };

    const clearFilter = () => {
        setFilterText("");
        setSelectedField("all");
        onFilter(plans);
    };

    return (
        <div className="flex gap-3 items-center mb-5">
            <select
                value={selectedField}
                onChange={handleFieldChange}
                className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option className="bg-white" value="all">All Fields</option>
                <option className="bg-white" value="name">Name</option>
                <option className="bg-white" value="price">Price</option>
                <option className="bg-white" value="data">Data</option>
                <option className="bg-white" value="duration">Duration</option>
            </select>

            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search plans..."
                    value={filterText}
                    onChange={handleInputChange}
                    className="bg-white w-full border px-3 py-2 pr-10 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {filterText && (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
                        onClick={clearFilter}
                        size="lg"
                    />
                )}
            </div>
        </div>
    );
};

export default FilterPlans;
