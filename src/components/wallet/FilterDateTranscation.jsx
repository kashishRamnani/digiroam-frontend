import { useEffect, useState } from "react";

const SortByDateTxn = ({ transactions = [], onSort }) => {
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!Array.isArray(transactions)) return;

    const sorted = [...transactions].sort((a, b) => {
      const dateA = new Date(a.madeAt);
      const dateB = new Date(b.madeAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    onSort(sorted);
  }, [sortOrder]);

  return (
    <div className="px-4 py-2">
      <label htmlFor="sortOrder" className="mr-2 text-sm font-medium">
        Sort by Date:
      </label>
      <select
        id="sortOrder"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="asc">↑ Oldest Date</option>
        <option value="desc">↓ Newest Date</option>
      </select>
    </div>
  );
};

export default SortByDateTxn;
