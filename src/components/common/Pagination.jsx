import React from "react";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ pageCount, currentPage, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage + 1}</span> of{" "}
            <span className="font-medium">{pageCount}</span>
          </p>
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
          previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
          onPageChange={onPageChange}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          forcePage={currentPage}
          renderOnZeroPageCount={null}
          containerClassName="flex items-center justify-center space-x-1"
          pageClassName="inline-flex"
          pageLinkClassName="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          activeClassName="active-page"
          activeLinkClassName="text-black bg-primary"
          previousClassName="inline-flex"
          nextClassName="inline-flex"
          previousLinkClassName="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          nextLinkClassName="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          breakClassName="inline-flex"
          breakLinkClassName="px-3 py-2 text-sm font-medium text-gray-700"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default Pagination;
