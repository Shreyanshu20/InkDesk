import React, { useState } from "react";
import StatusBadge from "../../Common/StatusBadge";

function ProductDetails({ product, onBack, onEdit, onDelete }) {
  const [activeImage, setActiveImage] = useState(0);

  // Format price in INR
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-text hover:text-primary mr-4 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-semibold text-text">
          Product Details
        </h1>
      </div>

      <div className="bg-background rounded-xl shadow-[0_4px_16px_rgba(17,17,26,0.05),_0_8px_32px_rgba(17,17,26,0.03)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(17,17,26,0.1),_0_8px_32px_rgba(17,17,26,0.05)] border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Product Images */}
          <div className="p-6 md:border-r border-gray-200 dark:border-gray-700">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg shadow-sm"
                />
                
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className={`h-16 w-full object-cover rounded-md cursor-pointer transition-all duration-200 ${
                          activeImage === idx 
                            ? 'ring-2 ring-primary shadow-md' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setActiveImage(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <i className="fas fa-image text-gray-400 text-3xl"></i>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-6 md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text">{product.name}</h2>
              <div className="flex items-center mt-2">
                <StatusBadge status={product.status} />
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
                {product.subcategory && (
                  <span className="ml-2 text-sm text-gray-400 dark:text-gray-500">
                    • {product.subcategory}
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-3xl font-bold text-text">{formatPrice(product.price)}</p>
                {product.discount > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {product.discount}% discount applied
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <i className="fas fa-box-open mr-1"></i>
                  {product.inventory} units in stock
                </p>
              </div>
              
              <div className="space-y-2">
                {product.brand && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                )}
                {product.rating > 0 && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-xs ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        ></i>
                      ))}
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
              <p className="text-text whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm"
              >
                <i className="fas fa-edit mr-2"></i> Edit
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-sm"
              >
                <i className="fas fa-trash mr-2"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;