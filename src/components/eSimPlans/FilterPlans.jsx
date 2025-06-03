import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import { faArrowDownWideShort, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

const FilterPlans = ({ plans = [], pricePercentage = 0, onFilter }) => {
  const [filterText, setFilterText] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [sortOrder, setSortOrder] = useState(""); 
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
    let filteredPlans = plans;

    if (query) {
      const lowerQuery = query.toLowerCase();

      filteredPlans = plans.filter((product) => {
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
      filteredPlans = sort(algo, filteredPlans);
    }

    onFilter(filteredPlans);
  };

  const clearFilter = () => {
    setFilterText("");
    setSelectedField("all");
    setSortOrder("");
    onFilter(plans);  
  };

  const sort = (algo, plans) => {
    return [...plans].sort((a, b) => {
      const priceA = getPriceWithMarkup(a.price, pricePercentage);
      const priceB = getPriceWithMarkup(b.price, pricePercentage);
      return algo === "asc" ? priceA - priceB : priceB - priceA;
    });
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
   setFilterText("");
    setSelectedField("all");

    applyFilter("", "all", newSortOrder);
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

      {/* <select onChange={handleSortChange} value={sortOrder} className="p-2 border rounded-md bg-white">
        <option value="">Price</option> 
        <option value="asc"> Low </option>
        <option value="desc"> High </option>
      </select> */}
      <div className="relative">
    <select
      onChange={handleSortChange}
      value={sortOrder}
     className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Price</option>
      <option value="asc">Low </option>
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

export default FilterPlans;
