function MobileRestriction() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-6">
      <div className="max-w-sm w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
              <i className="fas fa-desktop text-red-600 dark:text-red-400 text-3xl"></i>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Desktop Required
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No access on smaller devices. Please use a larger device.
          </p>

          <a
            href={import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173"}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Visit Store
          </a>
        </div>
      </div>
    </div>
  );
}

export default MobileRestriction;
