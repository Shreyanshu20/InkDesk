import React from "react";

function WishlistSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1a1212] rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 md:w-2/5 lg:w-1/3 bg-gray-300 dark:bg-gray-700 h-48 sm:h-full"></div>
        
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-1/3"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded mb-6 w-1/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-6 w-1/5"></div>
          
          <div className="flex flex-col xs:flex-row gap-3 mt-auto">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex-1"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistSkeleton;