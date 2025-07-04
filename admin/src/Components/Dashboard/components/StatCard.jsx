function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-text/70">{title}</h2>
        <div className={`rounded-full h-9 w-9 flex justify-center items-center bg-accent/20 dark:bg-accent/40 text-primary`}>
          <i className={`${icon} `}></i>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-text">{value}</p>
          <p className="text-xs flex items-center text-green-600 dark:text-green-400">
            <i className="fas fa-arrow-up mr-1"></i> {change}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;