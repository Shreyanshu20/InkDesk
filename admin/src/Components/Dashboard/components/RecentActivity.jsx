import React from "react";

function RecentActivity({ activities }) {
  // Helper function for activity icon styling
  const getActivityStyle = (type) => {
    switch (type) {
      case "order":
        return {
          bg: "bg-primary/10 dark:bg-primary/20",
          icon: "fas fa-shopping-bag text-primary",
        };
      case "product":
        return {
          bg: "bg-secondary/10 dark:bg-secondary/20",
          icon: "fas fa-box text-secondary",
        };
      case "review":
        return {
          bg: "bg-accent/10 dark:bg-accent/20",
          icon: "fas fa-star text-accent",
        };
      case "user":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          icon: "fas fa-user text-green-600 dark:text-green-400",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          icon: "fas fa-info-circle text-gray-600 dark:text-gray-400",
        };
    }
  };

  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-medium text-text mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
          >
            <div
              className={`mt-0.5 p-2 rounded-full ${
                getActivityStyle(activity.type).bg
              }`}
            >
              <i className={`${getActivityStyle(activity.type).icon} text-sm`}></i>
            </div>
            <div>
              <p className="text-sm text-text">{activity.message}</p>
              <p className="text-xs text-text/60 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;