import React, { useState } from "react";

const CouponSection = () => {
  const [couponCode, setCouponCode] = useState("");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <h3 className="font-medium text-text mb-3 flex items-center text-sm">
        <i className="fas fa-tag text-primary mr-2"></i>
        Have a coupon?
      </h3>
      <div className="flex flex-col md:flex-row gap-2 md:gap-0">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          className="flex-1 px-3 py-2 rounded-md md:rounded-l-md md:rounded-r-none border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary bg-background/80 text-text text-sm"
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded-md md:rounded-l-none md:rounded-r-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CouponSection;
