import React from "react";

function ProductFormFields({ formData, errors, categories, handleInputChange, formTouched }) {
  const hasError = (fieldName) => formTouched && errors[fieldName];
  
  const getFieldClasses = (fieldName) => 
    `w-full border ${hasError(fieldName) 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' 
      : 'border-gray-300 dark:border-gray-600 focus:ring-primary/30 focus:border-primary'
    } rounded-md px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
      hasError(fieldName) ? 'error-field' : ''
    }`;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
          Product Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={getFieldClasses('name')}
          placeholder="Enter product name"
          aria-invalid={hasError('name')}
          aria-describedby={hasError('name') ? 'name-error' : undefined}
          required
        />
        {hasError('name') && (
          <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
          Description<span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className={getFieldClasses('description')}
          placeholder="Enter product description"
          aria-invalid={hasError('description')}
          aria-describedby={hasError('description') ? 'description-error' : undefined}
          required
        ></textarea>
        {hasError('description') && (
          <p id="description-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text mb-1">
            Price (₹)<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">₹</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`${getFieldClasses('price')} pl-7`}
              placeholder="0.00"
              aria-invalid={hasError('price')}
              aria-describedby={hasError('price') ? 'price-error' : undefined}
              required
            />
          </div>
          {hasError('price') && (
            <p id="price-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
          )}
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-text mb-1">
            Stock<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            min="0"
            className={getFieldClasses('stock')}
            placeholder="Enter stock quantity"
            aria-invalid={hasError('stock')}
            aria-describedby={hasError('stock') ? 'stock-error' : undefined}
            required
          />
          {hasError('stock') && (
            <p id="stock-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text mb-1">
          Category<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`${getFieldClasses('category')} appearance-none`}
            aria-invalid={hasError('category')}
            aria-describedby={hasError('category') ? 'category-error' : undefined}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
            <i className="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
        {hasError('category') && (
          <p id="category-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-text mb-1">
            Subcategory
          </label>
          <input
            type="text"
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            className={getFieldClasses('subcategory')}
            placeholder="Enter subcategory"
          />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-text mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className={getFieldClasses('brand')}
            placeholder="Enter brand name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-text mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            min="0"
            max="100"
            className={getFieldClasses('discount')}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-text mb-1">
            Rating
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            min="0"
            max="5"
            step="0.1"
            className={getFieldClasses('rating')}
            placeholder="0.0"
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-text mb-2">
          Status
        </legend>
        <div className="space-y-2 flex justify-between">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.status === "active"}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
            />
            <div className="ml-3 flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span> 
              <span className="text-sm text-text">Active</span>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="low-stock"
              checked={formData.status === "low-stock"}
              onChange={handleInputChange}
              className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 dark:border-gray-600"
            />
            <div className="ml-3 flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span> 
              <span className="text-sm text-text">Low Stock</span>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="out-of-stock"
              checked={formData.status === "out-of-stock"}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 dark:border-gray-600"
            />
            <div className="ml-3 flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></span> 
              <span className="text-sm text-text">Out of Stock</span>
            </div>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export default ProductFormFields;