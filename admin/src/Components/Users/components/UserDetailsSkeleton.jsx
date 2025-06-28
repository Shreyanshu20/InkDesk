import React from "react";

function UserDetailsSkeleton() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              </div>
              <div className="ml-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-56 mb-2"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-16"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-56 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
            </div>
          ))}
        </div>

        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-44 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36"></div>
            </div>
          ))}
        </div>

        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsSkeleton;
