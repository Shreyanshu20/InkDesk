import React from "react";
import Button from "../../Common/Button";

const NoProduct = ({ clearFilters }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 p-12 text-center shadow-sm">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <i
          className="fas fa-search text-3xl text-gray-400"
          aria-hidden="true"
        ></i>
      </div>

      <h2 className="text-2xl font-semibold mb-3">No products found</h2>

      <p className="text-text/80 mb-6 max-w-md mx-auto">
        We couldn't find any products matching your search criteria. Try
        adjusting your filters or search terms.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={clearFilters} variant="primary" className="px-6 py-3">
          <i className="fas fa-times-circle mr-2"></i>
          Clear All Filters
        </Button>

        <Button as="link" to="/shop" variant="secondary" className="px-6 py-3">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Shop
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
        <p className="text-sm text-gray-500 mb-3">Popular categories:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            as="link"
            to="/shop/category/stationery"
            variant="link"
            size="sm"
          >
            Stationery
          </Button>
          <Button
            as="link"
            to="/shop/category/office-supplies"
            variant="link"
            size="sm"
          >
            Office Supplies
          </Button>
          <Button
            as="link"
            to="/shop/category/art-supplies"
            variant="link"
            size="sm"
          >
            Art Supplies
          </Button>
          <Button
            as="link"
            to="/shop/category/craft-materials"
            variant="link"
            size="sm"
          >
            Craft Materials
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoProduct;
