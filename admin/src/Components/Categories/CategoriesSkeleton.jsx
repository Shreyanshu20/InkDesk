import React from "react";

function CategoriesSkeleton() {
  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mb-3"></div>
          
          {/* Summary Stats Skeleton */}
          <div className="flex items-center gap-4 text-sm">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add Button Skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6">
        <div className="relative">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-5 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-18"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          </div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-5 gap-4 items-center">
              {/* Category Column with Image and Name */}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-3"></div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                </div>
              </div>
              
              {/* Subcategories Column */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-24"></div>
              
              {/* Products Column */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20"></div>
              
              {/* Created Column */}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              </div>
              
              {/* Actions Column */}
              <div className="flex items-center justify-start space-x-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Skeleton */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesSkeleton;