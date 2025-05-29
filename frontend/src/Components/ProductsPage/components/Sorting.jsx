import React from "react";

const Sorting = ({ totalProducts, sortOption, setSortOption }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-text flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
      <div className="mb-2 sm:mb-0">
        <p className="text-text font-medium">
          {totalProducts}{" "}
          <span className="text-text/70">
            {totalProducts === 1 ? "product" : "products"} found
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-text text-sm whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="py-2 px-3 border border-gray-300 dark:border-gray-500 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary text-text min-w-[160px]"
        >
          <option value="relevance">Relevance</option>
          <option value="product_price-asc">Price: Low to High</option>
          <option value="product_price-desc">Price: High to Low</option>
          <option value="product_rating-desc">Customer Rating</option>
          <option value="createdAt-desc">Newest First</option>
          <option value="product_name-asc">Name: A to Z</option>
          <option value="product_name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
};

export default Sorting;
