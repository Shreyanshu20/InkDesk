import React, { useState } from 'react';

const CouponSection = () => {
  const [couponCode, setCouponCode] = useState('');
  
  const handleApplyCoupon = () => {
    // Implement coupon logic here
    console.log('Applying coupon:', couponCode);
  };

  return (
    <div className="mt-6 bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-300 dark:border-gray-600">
      <h3 className="font-medium text-text mb-4 flex items-center">
        <i className="fas fa-tag text-primary mr-2"></i>
        Have a coupon?
      </h3>
      <div className="flex">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary bg-background/80 text-text"
        />
        <button 
          onClick={handleApplyCoupon}
          className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CouponSection;