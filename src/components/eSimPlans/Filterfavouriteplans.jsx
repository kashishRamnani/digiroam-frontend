import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const FilterFavPlans = ({ favouritePlans = [], pricePercentage = 0, onFilter } = {}) => {
    const [filterText, setFilterText] = useState("");
    const [selectedField, setSelectedField] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFilterText(value);
        applyFilter(value, selectedField, sortOrder);
    };

    const handleFieldChange = (e) => {
        const field = e.target.value;
        setSelectedField(field);
        applyFilter(filterText, field, sortOrder);
    };

    const applyFilter = (query, field, algo) => {
        if (!query) {
            onFilter(sort(algo, favouritePlans));
            return;
        }

        const lowerQuery = query.toLowerCase();

        const filteredResults = favouritePlans.filter((product) => {
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

        onFilter(sort(algo, filteredResults));
    };

    const clearFilter = () => {
        setFilterText("");
        setSelectedField("all");
        onFilter(sort(sortOrder, favouritePlans));
    };

    const sort = (algo, plans) => [...plans].sort((a, b) =>
        algo === "asc" ? a.price - b.price : b.price - a.price
    );

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        applyFilter(filterText, selectedField, e.target.value);
    };

    return (
        <div className="flex gap-3 items-center mb-5">
            <select
                value={selectedField}
                onChange={handleFieldChange}
                className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="data">Data</option>
                <option value="duration">Duration</option>
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

            <select onChange={handleSortChange} value={sortOrder} className="p-2 border rounded-md bg-white">
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
            </select>
        </div>
    );
};

export default FilterFavPlans;
