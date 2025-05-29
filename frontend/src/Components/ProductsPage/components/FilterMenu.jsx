import React, { useState } from "react";
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
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Count active filters
  const activeFilters =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[1] < 5000 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="bg-gray-50 dark:bg-gray-900 text-text rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Filters</h2>
          <Button
            onClick={clearFilters}
            variant="link"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
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

        {/* Price Range - Material UI Slider */}
        <div>
          <h3 className="font-medium  mb-3">
            Price Range: Up to {formatPrice(priceRange[1])}
          </h3>
          <div className="px-2 py-4">
            <Slider
              value={priceRange[1]}
              onChange={(event, newValue) => {
                console.log("MUI Slider changed:", newValue);
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
            <div className="flex justify-between mt-2 text-xs">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(5000)}</span>
            </div>
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-medium mb-3">Brands</h3>
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
          <h3 className="font-medium  mb-3">Availability</h3>
          <Checkbox
            id="in-stock"
            label="In Stock Only"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <i className="fas fa-filter"></i>
          <span>Filters</span>
          {activeFilters > 0 && (
            <span className="bg-white text-primary text-xs font-bold px-2 py-1 rounded-full">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-72">
        <div className="sticky top-4">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button
                  onClick={() => setIsMobileFilterOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </div>

            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterMenu;
