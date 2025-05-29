import React from "react";
import { Link } from "react-router-dom";

function WishlistEmpty() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 fade-in py-12">
      <div className="mb-6 text-primary text-7xl opacity-90">
        <i className="fas fa-heart-broken"></i>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Your Wishlist is Empty
      </h2>
      
      <div className="h-1 w-16 bg-primary mx-auto my-4"></div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
        Save items you love for future reference or to share with friends and family.
        Click the heart icon on any product to add it to your wishlist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/shop"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-full shadow transition-colors flex items-center justify-center"
        >
          <i className="fas fa-shopping-bag mr-2"></i>
          Explore Products
        </Link>
        
        <Link 
          to="/"
          className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3.5 rounded-full transition-colors flex items-center justify-center"
        >
          <i className="fas fa-home mr-2"></i>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default WishlistEmpty;