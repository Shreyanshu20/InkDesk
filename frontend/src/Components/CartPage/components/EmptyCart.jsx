import React from "react";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="text-center">
      <div className="max-w-md mx-auto">
        {/* Empty Cart Icon */}
        <div className="mb-8">
          <i className="fas fa-shopping-cart text-6xl text-gray-300"></i>
        </div>

        {/* Empty Cart Message */}
        <h2 className="text-2xl font-bold text-text mb-4">
          Your cart is empty
        </h2>
        <p className="text-text/60 mb-8">
          Looks like you haven't added anything to your cart yet. Start shopping
          to fill it up!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation("/shop")}
            className="inline-flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Start Shopping
          </button>

          <button
            onClick={() => handleNavigation("/")}
            className="inline-flex items-center justify-center w-full text-text/70 hover:text-primary px-6 py-2 transition-colors duration-300"
          >
            <i className="fas fa-home mr-2"></i>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
