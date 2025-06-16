function SubCategoriesSkeleton({ title }) {
  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse mb-4"></div>
          <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-3 md:p-4 text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SubCategoriesSkeleton;