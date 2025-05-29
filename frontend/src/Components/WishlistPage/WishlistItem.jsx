import React from "react";
import { Link } from "react-router-dom";
import StarRating from "../Common/StarRating";
import PriceDisplay from "../Common/PriceDisplay";

function WishlistItem({ item, onRemove, onAddToCart, onBuyNow, formatPrice }) {
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(item, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBuyNow(item);
  };
  
  return (
    <div className="bg-white dark:bg-[#1a1212] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        <Link 
          to={`/shop/product/${item.id}`} 
          className="sm:w-1/3 md:w-2/5 lg:w-1/3 relative overflow-hidden"
        >
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-48 sm:h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/api/placeholder/300/300";
            }}
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <p className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium uppercase">
                Out of Stock
              </p>
            </div>
          )}
          {item.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {Math.round(item.discount)}% OFF
            </div>
          )}
        </Link>
        
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  <Link 
                    to={`/shop/product/${item.id}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                </h3>
                
                {item.brand && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {item.brand}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleRemove}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-full ml-2"
                aria-label={`Remove ${item.title} from wishlist`}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-3">
              <StarRating rating={item.rating} size="sm" showText={false} />
            </div>
            
            <div className="mb-4">
              <PriceDisplay 
                price={item.discountedPrice || item.price}
                originalPrice={item.discount > 0 ? item.price : null}
                discount={item.discount}
                formatPrice={formatPrice}
                size="lg" 
              />
            </div>

            {item.inStock && (
              <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                ✓ {item.stock} in stock
              </p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              <i className="fas fa-calendar-alt mr-1.5"></i>
              Added on {new Date(item.dateAdded).toLocaleDateString()}
            </p>
          </div>
          
          {/* Updated action buttons with Buy Now */}
          <div className="flex flex-col gap-3">
            {/* Primary action buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors text-sm font-medium ${
                  item.inStock 
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={!item.inStock}
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Add to Cart
              </button>
              
              <button 
                onClick={handleBuyNow}
                className={`flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors text-sm font-medium ${
                  item.inStock 
                    ? "bg-primary hover:bg-primary/90 text-white shadow-sm" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={!item.inStock}
              >
                <i className="fas fa-bolt mr-2"></i>
                Buy Now
              </button>
            </div>
            
            {/* Secondary action button */}
            <Link 
              to={`/shop/product/${item.id}`}
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2.5 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <i className="fas fa-eye mr-2"></i>
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistItem;