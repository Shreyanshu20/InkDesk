import React from "react";
import { Link } from "react-router-dom";

function RecentOrders({ orders }) {
  // Helper function to get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Shipped":
        return "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary";
      case "Processing":
        return "bg-accent/10 text-accent dark:bg-accent/30 dark:text-accent";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-text">Recent Orders</h2>
        <Link
          to="/admin/orders"
          className="text-xs text-primary hover:underline flex items-center"
          aria-label="View all orders"
        >
          View all
          <i className="fas fa-chevron-right text-xs ml-1"></i>
        </Link>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
          >
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-primary">
                {order.id}
              </p>
              <span className="text-xs text-text/60">{order.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-text/60">{order.customer}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text">
                  {order.amount}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentOrders;
