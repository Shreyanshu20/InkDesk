import React, { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import Checkbox from "../../Common/Checkbox";
import Button from "../../Common/Button";

const FilterMenu = ({
  categories,
  selectedCategories,
  handleCategoryToggle,
  priceRange,
  setPriceRange,
  availableBrands,
  selectedBrands,
  handleBrandToggle,
  inStockOnly,
  setInStockOnly,
  clearFilters,
  formatPrice,
  isMobile = false,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Count active filters
  const activeFilters =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[1] < 5000 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileFilters]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3 text-text">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <Checkbox
                key={category._id}
                id={`category-${category._id}`}
                label={category.category_name}
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleCategoryToggle(category._id)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3 text-text">
          Price Range: Up to {formatPrice(priceRange[1])}
        </h3>
        <div className="px-2 py-4">
          <Slider
            value={priceRange[1]}
            onChange={(event, newValue) => {
              setPriceRange([0, newValue]);
            }}
            min={0}
            max={5000}
            step={10}
            sx={{
              color: "#be4857",
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                backgroundColor: "#be4857",
                border: "2px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                },
              },
              "& .MuiSlider-track": {
                backgroundColor: "#be4857",
                border: "none",
                height: 6,
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#e5e7eb",
                height: 6,
              },
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-text/70">
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(5000)}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium mb-3 text-text">Brands</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableBrands && availableBrands.length > 0 ? (
            availableBrands.map((brand) => (
              <Checkbox
                key={brand}
                id={`brand-${brand}`}
                label={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No brands available</p>
          )}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-medium mb-3 text-text">Availability</h3>
        <Checkbox
          id="in-stock"
          label="In Stock Only"
          checked={inStockOnly}
          onChange={() => setInStockOnly(!inStockOnly)}
        />
      </div>

      {/* Clear Filters Button - For both Mobile and Desktop */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={() => {
            clearFilters();
            if (isMobile) {
              setShowMobileFilters(false);
            }
          }}
          variant="outline"
          className="w-full"
          disabled={activeFilters === 0}
        >
          Clear All Filters
          {activeFilters > 0 && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center justify-center gap-2 px-6 py-3 text-text rounded-xl transition-all duration-200 flex-1 font-semibold"
        >
          <i className="fas fa-filter text-sm text-primary"></i>
          <span className="text-sm uppercase tracking-wide">FILTER</span>
          {activeFilters > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>

        {/* Mobile Filter Panel */}
        <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${showMobileFilters ? 'visible' : 'invisible'}`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
              showMobileFilters ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Filter Panel */}
          <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out z-40 ${
            showMobileFilters ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 z-20">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-text">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-text transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FilterContent />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <div className="w-72">
      <div className="sticky top-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Desktop Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg text-text">Filters</h2>
          </div>
          
          <div className="p-4">
            <FilterContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;