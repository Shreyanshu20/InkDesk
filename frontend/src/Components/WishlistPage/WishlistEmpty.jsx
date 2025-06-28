import React from "react";
import { useNavigate } from "react-router-dom";

function WishlistEmpty() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="relative mb-6">
          <i className="fas fa-heart text-6xl md:text-7xl text-gray-200 dark:text-gray-700"></i>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-search text-2xl md:text-3xl text-gray-400"></i>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-text mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-text/70 text-sm md:text-base mb-6 leading-relaxed">
          Start adding products you love to your wishlist. It's a great way to
          keep track of items you want to buy later!
        </p>
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/products")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-shopping-bag"></i>
            Start Shopping
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-200 dark:border-gray-600 text-text hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-home"></i>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistEmpty;