import React from "react";

function ProductFormFields({
  formData,
  errors,
  categories,
  subcategories = [],
  handleInputChange,
  handleFieldBlur,
  touchedFields = {},
}) {
  const hasError = (fieldName) => touchedFields[fieldName] && errors[fieldName];

  const getFieldClasses = (fieldName) =>
    `w-full border ${
      hasError(fieldName)
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-gray-300 dark:border-gray-600 focus:ring-primary/30 focus:border-primary"
    } rounded-md px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`;

  const handleBlur = (fieldName) => {
    if (handleFieldBlur) {
      handleFieldBlur(fieldName);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Product Information
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={() => handleBlur("name")}
          className={getFieldClasses("name")}
          placeholder="Enter product name (3-100 characters)"
          aria-describedby={hasError("name") ? "name-error" : undefined}
          aria-invalid={hasError("name")}
        />
        {hasError("name") && (
          <p
            id="name-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <i className="fas fa-exclamation-circle mr-1"></i>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          onBlur={() => handleBlur("description")}
          className={getFieldClasses("description")}
          placeholder="Enter detailed product description (10-1000 characters)"
          aria-describedby={
            hasError("description") ? "description-error" : undefined
          }
          aria-invalid={hasError("description")}
        />
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.description.length}/1000 characters
        </div>
        {hasError("description") && (
          <p
            id="description-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <i className="fas fa-exclamation-circle mr-1"></i>
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            onBlur={() => handleBlur("price")}
            className={getFieldClasses("price")}
            placeholder="0.00"
            min="0.01"
            max="1000000"
            step="0.01"
            aria-describedby={hasError("price") ? "price-error" : undefined}
            aria-invalid={hasError("price")}
          />
          {hasError("price") && (
            <p
              id="price-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            onBlur={() => handleBlur("stock")}
            className={getFieldClasses("stock")}
            placeholder="0"
            min="0"
            max="100000"
            step="1"
            aria-describedby={hasError("stock") ? "stock-error" : undefined}
            aria-invalid={hasError("stock")}
          />
          {hasError("stock") && (
            <p
              id="stock-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          onBlur={() => handleBlur("category")}
          className={getFieldClasses("category")}
          aria-describedby={hasError("category") ? "category-error" : undefined}
          aria-invalid={hasError("category")}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {hasError("category") && (
          <p
            id="category-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <i className="fas fa-exclamation-circle mr-1"></i>
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="subcategory"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Subcategory <span className="text-red-500">*</span>
        </label>
        <select
          id="subcategory"
          name="subcategory"
          value={formData.subcategory}
          onChange={handleInputChange}
          onBlur={() => handleBlur("subcategory")}
          className={getFieldClasses("subcategory")}
          disabled={!formData.category || subcategories.length === 0}
          aria-describedby={
            hasError("subcategory") ? "subcategory-error" : undefined
          }
          aria-invalid={hasError("subcategory")}
        >
          <option value="">
            {!formData.category
              ? "Select a category first"
              : subcategories.length === 0
              ? "No subcategories available"
              : "Select a subcategory"}
          </option>
          {subcategories.map((subcategory) => (
            <option key={subcategory._id} value={subcategory.subcategory_name}>
              {subcategory.subcategory_name}
            </option>
          ))}
        </select>
        {hasError("subcategory") && (
          <p
            id="subcategory-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <i className="fas fa-exclamation-circle mr-1"></i>
            {errors.subcategory}
          </p>
        )}
        {formData.category &&
          subcategories.length === 0 &&
          !hasError("subcategory") && (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
              <i className="fas fa-info-circle mr-1"></i>
              No subcategories found for this category. You may need to add
              subcategories first.
            </p>
          )}
      </div>

      <div>
        <label
          htmlFor="brand"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Brand <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          onBlur={() => handleBlur("brand")}
          className={getFieldClasses("brand")}
          placeholder="Enter brand name (2-50 characters)"
          aria-describedby={hasError("brand") ? "brand-error" : undefined}
          aria-invalid={hasError("brand")}
        />
        {hasError("brand") && (
          <p
            id="brand-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            <i className="fas fa-exclamation-circle mr-1"></i>
            {errors.brand}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Discount (%) <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            onBlur={() => handleBlur("discount")}
            className={getFieldClasses("discount")}
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
            aria-describedby={
              hasError("discount") ? "discount-error" : undefined
            }
            aria-invalid={hasError("discount")}
          />
          {hasError("discount") && (
            <p
              id="discount-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors.discount}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Rating (0-5) <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            onBlur={() => handleBlur("rating")}
            className={getFieldClasses("rating")}
            placeholder="0"
            min="0"
            max="5"
            step="0.1"
            aria-describedby={hasError("rating") ? "rating-error" : undefined}
            aria-invalid={hasError("rating")}
          />
          {hasError("rating") && (
            <p
              id="rating-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors.rating}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className={getFieldClasses("status")}
        >
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}

export default ProductFormFields;
