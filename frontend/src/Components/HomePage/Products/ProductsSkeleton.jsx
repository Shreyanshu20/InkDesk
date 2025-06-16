function ProductsSkeleton() {
  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 lg:mb-8">
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse hidden md:block"></div>
        </div>

        <div className="flex overflow-x-auto mb-4 md:mb-6 lg:mb-8 border-b border-gray-200 dark:border-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 md:py-3 mr-2 md:mr-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-3 lg:p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsSkeleton;