import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faArrowDownWideShort,
  faArrowUpWideShort,
} from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const FilterFavPlans = ({ favouritePlans = [], pricePercentage = 0, onFilter }) => {
  const [filterText, setFilterText] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [sortOrder, setSortOrder] = useState("");

  const applyFilter = (query, field, algo) => {
    let filteredfavPlans = [...favouritePlans]

    if (query) {
      const lowerQuery = query.toLowerCase();

      filteredfavPlans = favouritePlans.filter((product) => {
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
    }

    if (algo === "asc" || algo === "desc") {
      filteredfavPlans = sortPlans(algo, filteredfavPlans);
    }
console.log("Sorted Plans:", filteredfavPlans);
    onFilter(filteredfavPlans);
  };

  const clearFilter = () => {
    setFilterText("");
    setSelectedField("all");
    setSortOrder("");
    
    onFilter(favouritePlans); 
  };

const sortPlans = (algo, favouritePlans) => {
    return [...favouritePlans].sort((a, b) => {
      const priceA = getPriceWithMarkup(a.price, pricePercentage);
      const priceB = getPriceWithMarkup(b.price, pricePercentage);
      return algo === "asc" ? priceA - priceB : priceB - priceA;
    });
  };



  const handleInputChange = (e) => {
    const text = e.target.value;
    setFilterText(text);
    applyFilter(text, selectedField, sortOrder);
  };

  const handleFieldChange = (e) => {
    const field = e.target.value;
    setSelectedField(field);
    applyFilter(filterText, field, sortOrder);
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setFilterText("");
    setSelectedField("all");
    console.log("Sort triggered with:", newSortOrder);
    applyFilter("", "all", newSortOrder);
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
          placeholder="Search favourite plans..."
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

      <div className="relative">
        <select
          onChange={handleSortChange}
          value={sortOrder}
          className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Price</option>
          <option value="asc">Low</option>
          <option value="desc">High</option>
        </select>
        {sortOrder === "asc" && (
          <FontAwesomeIcon
            icon={faArrowDownWideShort}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
          />
        )}
        {sortOrder === "desc" && (
          <FontAwesomeIcon
            icon={faArrowUpWideShort}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
          />
        )}
      </div>
    </div>
  );
};

export default FilterFavPlans;