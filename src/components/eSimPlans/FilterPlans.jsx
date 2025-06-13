import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
;
import { faTimesCircle, faFilter } from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import ApplyFilter from "./ApplyFilterPlans";

const FilterPlans = forwardRef(({ plans = [], pricePercentage = 0, onFilter, value,setIsFiltered }, ref) => {
  const [filterText, setFilterText] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [showFilter, setShowFilter] = useState(false);


  const handleOpenFilter = () => setShowFilter(true);
  const handleCloseFilter = () => setShowFilter(false);

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

  useImperativeHandle(ref, () => ({
    applyInitialFilter: () => {
      if (plans.length > 0 && value?.trim()) {
        setFilterText(value);
        applyFilter(value.trim(), selectedField, sortOrder || "asc");
      }
    },
  }));

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

     
     
      <button
        onClick={handleOpenFilter}
         className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
      >
        <FontAwesomeIcon icon={faFilter} className=" mr-2" />
        Filter
      </button>

      <ApplyFilter
        plans={plans}
        show={showFilter}
        onClose={handleCloseFilter}
        onFilter={onFilter}
        setIsFiltered={setIsFiltered}
      />
    </div>
    
  );
});

export default FilterPlans;