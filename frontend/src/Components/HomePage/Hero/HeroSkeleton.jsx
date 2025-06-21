function HeroSkeleton() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-gray-200 dark:bg-gray-700">
      <div className="absolute inset-0 animate-pulse">
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center px-8 lg:px-16">
        <div className="max-w-lg md:max-w-xl lg:max-w-2xl space-y-4 md:space-y-6">
          <div className="w-96 h-8 md:h-12 lg:h-16 bg-gray-400 dark:bg-gray-500 rounded animate-pulse"></div>
          <div className="h-4 md:h-6 bg-gray-400 dark:bg-gray-500 rounded w-3/4 animate-pulse"></div>
          <div className="h-10 md:h-12 bg-gray-400 dark:bg-gray-500 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
        ))}
      </div>
    </section>
  );
}

export default HeroSkeleton;