import React, { useState } from "react";
import StatusBadge from "../../Common/StatusBadge";

function ProductDetails({ product, onBack, onEdit, onDelete }) {
  const [activeImage, setActiveImage] = useState(0);

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString("en-IN")}`;
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 mr-4"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Product Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage product information
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center font-medium shadow-sm"
          >
            <i className="fas fa-edit mr-2 text-sm"></i>
            Edit Product
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center font-medium shadow-sm"
          >
            <i className="fas fa-trash mr-2 text-sm"></i>
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          <div className="lg:col-span-1">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700"
                  />
                </div>

                {product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          activeImage === idx
                            ? "border-primary"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <i className="fas fa-image text-gray-400 text-4xl mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No images available
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {product.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <StatusBadge status={product.status} />
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.subcategory && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {product.subcategory}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(product.price)}
                  </p>
                  {product.discount > 0 && (
                    <div className="flex items-center mt-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-md text-sm font-medium">
                        <i className="fas fa-tag mr-1"></i>
                        {product.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      product.inventory > 10
                        ? "bg-green-500"
                        : product.inventory > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {product.inventory} units in stock
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {product.brand && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <i className="fas fa-tag text-gray-600 dark:text-gray-400"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Brand
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {product.brand}
                      </p>
                    </div>
                  </div>
                )}

                {product.rating > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <i className="fas fa-star text-yellow-600 dark:text-yellow-400"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rating
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star text-sm ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {product.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <i className="fas fa-align-left mr-2 text-gray-600 dark:text-gray-400"></i>
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;