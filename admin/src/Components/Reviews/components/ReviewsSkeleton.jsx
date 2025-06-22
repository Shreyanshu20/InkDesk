import React from 'react';

const ReviewsSkeleton = () => {
  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-96 animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Controls Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Input Skeleton */}
            <div className="relative flex-1 max-w-md">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            {/* Filter Dropdown Skeleton */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-48 animate-pulse"></div>
          </div>
          {/* Refresh Button Skeleton */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {/* Table Header Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14 animate-pulse"></div>
            </div>
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Customer Column */}
                <div className="flex items-center w-32">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                </div>

                {/* Product Column */}
                <div className="flex items-center w-28">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                  </div>
                </div>

                {/* Rating Column */}
                <div className="flex items-center w-16">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4 mr-1 animate-pulse"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <div key={starIndex} className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Review Column */}
                <div className="w-32">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                </div>

                {/* Date Column */}
                <div className="w-20">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center space-x-1 w-16">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSkeleton;