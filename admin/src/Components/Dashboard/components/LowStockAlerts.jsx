import React from "react";
import { Link } from "react-router-dom";

function LowStockAlerts({ items }) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-text">Low Stock Alerts</h2>
        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
          {items.length} items
        </span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-text">
                    {item.name}
                  </p>
                  <p className="text-xs text-accent flex items-center mt-1">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    Only {item.stock} left (min: {item.threshold})
                  </p>
                </div>
                <Link
                  to={`/admin/products/${item.id}`}
                  className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 dark:hover:bg-primary/30 transition-all"
                >
                  Restock
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-check-circle text-3xl text-green-500 mb-2"></i>
          <p className="text-sm text-text">
            All products are well stocked!
          </p>
        </div>
      )}
    </div>
  );
}

export default LowStockAlerts;