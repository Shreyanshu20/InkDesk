import React from "react";

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-10 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"
                ></div>
              ))}
            </div>
          </div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36 mb-6"></div>
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-12"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-4 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
