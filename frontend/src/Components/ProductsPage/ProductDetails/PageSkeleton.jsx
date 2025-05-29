import React from "react";

function PageSkeleton() {
  return (
    <div className="bg-background text-text animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="container mx-auto px-6 py-4">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
      </div>

      {/* Product Details Skeleton */}
      <div className="container mx-auto px-6 lg:px-20 py-7">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image Skeleton */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-24">
              <div className="relative mb-6 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-300 dark:bg-gray-700">
                <div className="aspect-[3/4] w-full"></div>
              </div>

              {/* Thumbnail Skeletons */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-md bg-gray-300 dark:bg-gray-700 flex-shrink-0"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="w-full lg:w-3/5">
            {/* Title & Author */}
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-5"></div>

            {/* Ratings */}
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-5"></div>

            {/* Price */}
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-2/5 mb-6"></div>

            <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>

            {/* Description */}
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5 mb-6"></div>

            <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>

            {/* Product Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Skeleton */}
      <div className="container mx-auto px-6 lg:px-20 py-10">
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-300 dark:border-gray-700">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex-1 py-5 px-6">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="p-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-3"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
