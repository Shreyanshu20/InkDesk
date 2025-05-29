import React from "react";

function FreeShippingInfo({ amountForFreeShipping }) {
  return (
    <>
      {amountForFreeShipping <= 0 && (
        <div className="mx-6 mt-4 p-3 bg-background border border-green-700 rounded-lg">
          <div className="flex items-center text-green-700 dark:text-green-400">
            <i className="fas fa-check-circle mr-2"></i>
            <p className="text-sm font-medium">
              Your order qualifies for FREE shipping!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default FreeShippingInfo;
