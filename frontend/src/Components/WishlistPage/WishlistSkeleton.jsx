import React from "react";

function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-background text-text py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-3 md:px-4 lg:px-6">
        {/* Header Skeleton */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div>
              <div className="h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 md:w-48 mb-1 md:mb-2 animate-pulse"></div>
              <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-64 animate-pulse"></div>
            </div>
            <div className="h-4 md:h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 md:w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 md:space-y-6">
          {/* Items Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="aspect-square md:aspect-[3/4] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

                {/* Content Skeleton */}
                <div className="p-2 md:p-3 space-y-1 md:space-y-2">
                  {/* Title */}
                  <div className="space-y-1">
                    <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </div>

                  {/* Brand */}
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="h-4 md:h-5 bg-gray-200 dark:bg-gray-700 rounded w-12 md:w-16 animate-pulse"></div>
                    <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 md:w-12 animate-pulse"></div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-1 md:space-y-1.5 pt-1">
                    <div className="h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </div>

                  {/* Date - Only on larger screens */}
                  <div className="hidden md:block pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-64 animate-pulse"></div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 md:w-32 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20 md:w-28 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="text-center mt-6 md:mt-8">
          <div className="inline-flex items-center gap-2 text-text/70">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading your wishlist...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistSkeleton;
