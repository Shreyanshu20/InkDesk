function CategoriesSkeleton() {
  return (
    <section className="bg-background text-text py-8 px-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="text-center mb-10">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse mb-4"></div>
          <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
        </div>

        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[70vh]">
          <div className="col-span-2 row-span-2 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          <div className="col-span-2 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          <div className="col-span-1 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          <div className="col-span-1 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        </div>

        <div className="md:hidden grid grid-cols-1 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSkeleton;