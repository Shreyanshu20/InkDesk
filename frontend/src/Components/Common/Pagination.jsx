import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const getPageNumbers = () => {
    const pages = [];

    pages.push(1);

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 50); 
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="h-10 w-10 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-background text-text hover:bg-gray-50 hover:dark:bg-gray-700 disabled:opacity-50"
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
        </button>

        {pageNumbers.map((pageNumber, index) => {
          if (index > 0 && pageNumber - pageNumbers[index - 1] > 1) {
            return (
              <React.Fragment key={`ellipsis-${pageNumber}`}>
                <span className="h-10 w-6 flex items-center justify-center">
                  ...
                </span>
                <button
                  onClick={() => handlePageChange(pageNumber)}
                  className={`h-10 w-10 flex items-center justify-center rounded ${
                    currentPage === pageNumber
                      ? "bg-primary text-white"
                      : "border border-gray-300 dark:border-gray-600 bg-background text-text hover:bg-gray-50 hover:dark:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              </React.Fragment>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`h-10 w-10 flex items-center justify-center rounded ${
                currentPage === pageNumber
                  ? "bg-primary text-white"
                  : "border border-gray-300 dark:border-gray-600 bg-background text-text hover:bg-gray-50 hover:dark:bg-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-10 w-10 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-background text-gray-500 hover:bg-gray-50 hover:dark:bg-gray-700 disabled:opacity-50"
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
