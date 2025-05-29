import React from 'react';

const FreeShippingProgressBar = ({ amountForFreeShipping, freeShippingProgress, formatPrice }) => {
  if (amountForFreeShipping <= 0) return null;
  
  return (
    <div className="mb-6 bg-gray-100 dark:bg-gray-900 rounded-xl p-4 border border-gray-300 dark:border-gray-600 shadow-sm">
      <div className="flex items-center mb-2">
        <i className="fas fa-truck text-primary mr-2"></i>
        <p className="text-sm text-text">
          Add{" "}
          <span className="font-bold text-primary">
            {formatPrice(amountForFreeShipping)}
          </span>{" "}
          more to qualify for{" "}
          <span className="font-bold text-green-600">
            FREE shipping
          </span>
        </p>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${freeShippingProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FreeShippingProgressBar;