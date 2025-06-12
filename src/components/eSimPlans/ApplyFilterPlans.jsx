import React, {
    useMemo,
    useState,
    useImperativeHandle,
    forwardRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDownWideShort,
    faArrowUpWideShort,
} from "@fortawesome/free-solid-svg-icons";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
const ApplyFilter = forwardRef(({ plans = [], show, onClose, onFilter }, ref) => {
    const [filter, setFilter] = useState({ duration: "" });
    const [sortOrder, setSortOrder] = useState("all");
    const [datafilter, setDataFilter] = useState("all");

    useImperativeHandle(ref, () => ({
        applyInitialFilter: () => {
            onFilter(plans);
        },
    }));

    const durationOptions = useMemo(() => {
        const formattedDurations = plans.map((p) => {
            const unit = p.durationUnit.toLowerCase();
            const pluralizedUnit = p.duration === 1 ? unit : `${unit}s`;
            return {
                label: `${p.duration} ${pluralizedUnit}`,
                value: `${p.duration}-${unit}`,
            };
        });

        const uniqueMap = new Map();
        formattedDurations.forEach((item) => {
            uniqueMap.set(item.label, item);
        });

        const uniqueSorted = Array.from(uniqueMap.values()).sort((a, b) => {
            const [aNum] = a.value.split("-");
            const [bNum] = b.value.split("-");
            return Number(aNum) - Number(bNum);
        });

        return uniqueSorted;
    }, [plans]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handlesort = (e) =>{
     setDataFilter(e.target.value)
    }
    const handleApply = () => {
        let filtered = [...plans];

        if (filter.duration) {
            const [selectedDuration, selectedUnit] = filter.duration.split("-");
            filtered = filtered.filter((product) =>
                product.duration === Number(selectedDuration) &&
                product.durationUnit.toLowerCase() === selectedUnit
            );
        }

        if (sortOrder !== "all") {
            filtered.sort((a, b) => {
                const priceA = getPriceWithMarkup(a.price);
                const priceB = getPriceWithMarkup(b.price);
                return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
            });
        }

       if (datafilter !== "all") {filtered.sort((a, b) => {
        return datafilter === "asc"? a.volume - b.volume : b.volume - a.volume;
    });
}

    
        onFilter(filtered);
        onClose();
    };

    if (!show) return null;

    return (
       <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
      role="dialog"
      aria-labelledby="applyfilters"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>

        <h3 id="applyfilter" className="text-2xl font-semibold mb-6 text-gray-800 z-10 relative">
        Apply Filters 
        </h3>

                <div className="grid grid-cols-1 md:grid-rows-2 gap-4">
                    {/* Duration Filter */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Sort By Duration</label>
                        <select
                            name="duration"
                            value={filter.duration}
                            onChange={handleChange}
                            className="w-full border bg-white rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" >All</option>
                            {durationOptions.map((d, idx) => (
                                <option key={idx} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort by Price */}
                    <div className="relative">
                        <label className="block mb-2 font-medium text-gray-700">Sort by Price</label>
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="w-full border  bg-white rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                        </select>

                        {sortOrder === "asc" && (
                            <FontAwesomeIcon
                                icon={faArrowDownWideShort}
                                className="absolute right-3 top-[38px] text-gray-500 pointer-events-none"
                            />
                        )}
                        {sortOrder === "desc" && (
                            <FontAwesomeIcon
                                icon={faArrowUpWideShort}
                                className="absolute right-3 top-[38px] text-gray-500 pointer-events-none"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Sort By Data</label>
                        <select
                            value={datafilter}
                            onChange={handlesort}
                            className="w-full border  bg-white rounded-md p-2 focus:ring-2 focus:ring-blue-500"

                        >
                            <option value="all">All</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-8 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ApplyFilter;
