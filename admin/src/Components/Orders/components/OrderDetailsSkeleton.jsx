import React from "react";

function OrderDetailsSkeleton() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-4"></div>
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-44 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                </div>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsSkeleton;
