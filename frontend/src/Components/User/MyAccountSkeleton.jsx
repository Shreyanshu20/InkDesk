function MyAccountSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8 px-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-4 px-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-56 animate-pulse mb-6"></div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center md:text-left">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mb-2 mx-auto md:mx-0"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mx-auto md:mx-0"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mb-2"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mb-2"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse mt-2"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mt-2"></div>
              </div>
              <div className="flex justify-end pt-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccountSkeleton;