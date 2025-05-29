import React from "react";

const BulkActions = ({ selectedOrders, handleDelete }) => {
  if (selectedOrders.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-700 z-10">
      <span>{selectedOrders.length} selected</span>
      <button
        onClick={() => handleDelete(selectedOrders)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
      >
        Delete
      </button>
    </div>
  );
};

export default BulkActions;
