function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Skeleton */}
      <div className="container mx-auto px-6 lg:px-20 py-4">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Main Product Details Skeleton */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-2 md:py-5">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex gap-2 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-4">
              {/* Title */}
              <div className="h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              
              {/* Brand */}
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              </div>
              
              {/* Rating */}
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              
              {/* Price */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-6 md:h-7 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  <div className="flex-1 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
                <div className="w-full h-11 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>

              {/* Features */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;