import React from "react";

const BulkActions = ({ 
  selectedItems = [], 
  actions = [],
  entityName = "items",
  position = "bottom-right" // Options: bottom-right, bottom-left, top-right, top-left
}) => {
  if (selectedItems.length === 0) return null;

  // Position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  return (
    <div className={`fixed ${positionClasses[position]} bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-700 z-10`}>
      <span className="text-sm font-medium">
        {selectedItems.length} {selectedItems.length === 1 ? entityName.slice(0, -1) : entityName} selected
      </span>
      
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.onClick(selectedItems)}
          className={action.className || "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"}
          disabled={action.disabled}
          title={action.title}
        >
          {action.icon && <i className={`${action.icon} ${action.label ? 'mr-2' : ''}`}></i>}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default BulkActions;