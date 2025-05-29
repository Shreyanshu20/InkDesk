import React from "react";

const Pagination = ({
  page,
  rowsPerPage,
  filteredOrders,
  handlePageChange,
  handleRowsPerPageChange,
}) => {
  return (
    <div className="px-6 py-3 flex flex-wrap gap-4 items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
          Rows per page:
        </span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border border-gray-300 dark:border-gray-600 rounded-md text-sm px-2 py-1 bg-white dark:bg-gray-800"
        >
          {[5, 10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          {filteredOrders.length > 0 ? page * rowsPerPage + 1 : 0} to{" "}
          {Math.min((page + 1) * rowsPerPage, filteredOrders.length)} of{" "}
          {filteredOrders.length} entries
        </p>
      </div>

      <div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {[
            ...Array(Math.ceil(filteredOrders.length / rowsPerPage)).keys(),
          ].map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`relative inline-flex items-center px-4 py-2 border ${
                page === number
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              } text-sm font-medium`}
              aria-current={page === number ? "page" : undefined}
            >
              {number + 1}
            </button>
          ))}

          <button
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page + 1)}
            disabled={
              page >= Math.ceil(filteredOrders.length / rowsPerPage) - 1
            }
            aria-label="Next page"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;