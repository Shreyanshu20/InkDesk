import React from "react";

function Pagination({
  page,
  rowsPerPage,
  totalItems,
  handlePageChange,
  handleRowsPerPageChange,
  entityName = "items",
}) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate range around current page
    const start = Math.max(0, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    // Always include first page
    if (start > 0) {
      range.push(0);
      if (start > 1) {
        range.push("...");
      }
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Always include last page
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        range.push("...");
      }
      range.push(totalPages - 1);
    }

    return range;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results info */}
        <div className="flex-1 flex justify-between sm:hidden">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> {entityName}
          </p>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{totalItems}</span> {entityName}
            </p>
          </div>

          {/* Page navigation */}
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                page === 0
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {/* Page numbers */}
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {pageNumbers.map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrentPage = pageNum === page;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isCurrentPage
                        ? "z-10 bg-primary text-white border-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                    } border`}
                    aria-current={isCurrentPage ? "page" : undefined}
                    aria-label={`Page ${pageNum + 1}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </nav>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                page >= totalPages - 1
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
              aria-label="Next page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Mobile pagination */}
        <div className="flex justify-between sm:hidden w-full">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              page === 0
                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
            }`}
          >
            <i className="fas fa-chevron-left mr-1"></i>
            Previous
          </button>

          <span className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              page >= totalPages - 1
                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Next
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <label
            htmlFor="rows-per-page"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Show:
          </label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="block w-auto px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            per page
          </span>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
