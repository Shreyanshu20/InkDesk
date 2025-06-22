import React from "react";

function UsersSkeleton() {
  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-56 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-80"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          </div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-6 gap-4 items-center">
              {/* User Info */}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-3"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
                  </div>
                </div>
              </div>
              
              {/* Role */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-16"></div>
              
              {/* Status */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20"></div>
              
              {/* Phone */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              
              {/* Date */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
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

export default UsersSkeleton;