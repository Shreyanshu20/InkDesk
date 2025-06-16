function MyOrdersSkeleton() {
  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2 sm:mb-3"></div>
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm mb-6 sm:mb-8 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 flex-shrink-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders List Skeleton */}
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Order Header Skeleton */}
                <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
                  {/* Mobile Layout */}
                  <div className="flex items-start justify-between sm:hidden">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-1"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div>
                        <div className="h-5 lg:h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-1"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                      <div className="text-right">
                        <div className="h-6 lg:h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mb-1"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Skeleton */}
                <div className="mb-4 sm:mb-6">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-3 sm:mb-4"></div>
                  
                  {/* Mobile Items */}
                  <div className="space-y-3 sm:hidden">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-1"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Items */}
                  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 lg:p-4">
                        <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3 lg:h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-1"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1 sm:flex-none sm:w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1 sm:flex-none sm:w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrdersSkeleton;