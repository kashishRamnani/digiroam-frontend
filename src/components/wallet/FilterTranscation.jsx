import { useEffect, useState } from "react";

const FilterTranscation = ({ transactions = [], onFilter }) => {
  const [filtertype, setFilterType] = useState("all");

  const applyFilters = () => {
    if (filtertype === "all") {
      onFilter(transactions);
    } else {
      const filtered = transactions.filter(
        (txn) => txn.type.toLowerCase() === filtertype.toLowerCase()
      );
      onFilter(filtered);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filtertype, transactions]);

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="px-4 py-2">
          <label htmlFor="filterType" className="mr-2 text-sm font-medium">Filter by Type:</label>
      <select
        value={filtertype}
        onChange={handleFilter}
        
        className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">ALL</option>
        <option value="deposit">DEPOSTE</option>
        <option value="refund">REFUND</option>
        <option value="purchase">PURCHASE</option>
      </select>
    </div>
  );
};

export default FilterTranscation;
