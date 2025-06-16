function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-4 sm:mb-6"></div>
          
          {/* Mobile Header */}
          <div className="block sm:hidden">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2 sm:mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="h-10 lg:h-12 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Order Info Section Skeleton */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-1 sm:mb-2 mx-auto sm:mx-0"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mx-auto sm:mx-0"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items Skeleton */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-4 sm:mb-6"></div>

            {/* Mobile Items */}
            <div className="space-y-4 sm:hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-2"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse ml-auto"></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 lg:p-6">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center">
                        <div className="w-16 lg:w-20 h-20 lg:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mr-4 lg:mr-6"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mx-auto"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse ml-auto"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Summary */}
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-4 sm:mb-6"></div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl space-y-3 sm:space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse mb-4 sm:mb-6"></div>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl space-y-2 sm:space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information Skeleton */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-3 sm:mr-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-1 sm:mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-1 sm:mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-36 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-32 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full sm:w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsSkeleton;