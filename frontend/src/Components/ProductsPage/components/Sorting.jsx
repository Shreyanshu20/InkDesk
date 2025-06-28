import React, { useState, useRef, useEffect } from "react";

const Sorting = ({ sortOption, setSortOption, isMobile = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "product_price-asc", label: "Price: Low to High" },
    { value: "product_price-desc", label: "Price: High to Low" },
    { value: "product_rating-desc", label: "Customer Rating" },
    { value: "createdAt-desc", label: "Newest First" },
    { value: "product_name-asc", label: "Name: A to Z" },
    { value: "product_name-desc", label: "Name: Z to A" },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortOption);
    return option ? option.label : "Sort";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={sortRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center justify-center gap-2 px-6 py-3 text-text rounded-xl transition-all duration-300 md:border md:border-gray-200 md:dark:border-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 ${
          isMobile ? "flex-1 font-semibold" : "min-w-40 font-medium"
        }`}
      >
        {!isMobile && (
          <span className="text-text/70 text-sm font-medium">Sort by:</span>
        )}
        <div className="flex items-center gap-2">
          <i className="fas fa-sort text-sm text-primary"></i>
          <span
            className={`font-semibold ${
              isMobile ? "uppercase text-sm tracking-wide" : ""
            }`}
          >
            {isMobile ? "SORT" : getCurrentSortLabel()}
          </span>
          <i
            className={`fas fa-chevron-${
              showDropdown ? "up" : "down"
            } text-xs transition-transform duration-200 text-primary`}
          ></i>
        </div>
      </button>
      {showDropdown && (
        <div
          className={`absolute ${
            isMobile ? "right-0 bottom-full mb-2" : "left-0 top-full mt-2"
          } bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 ${
            isMobile ? "min-w-48" : "min-w-52"
          } animate-in slide-in-from-top-2 duration-200 overflow-hidden`}
        >
          <div className="p-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortOption(option.value);
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors font-medium ${
                  sortOption === option.value
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-text"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sorting;
