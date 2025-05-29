import React from "react";

const BulkActions = ({ 
  selectedItems = [], 
  selectedCount, // Keep for backward compatibility
  actions = [],
  entityName = "items",
  position = "bottom-right",
  onDelete, // Legacy prop
  onClearSelection // Legacy prop
}) => {
  // Support both selectedItems and selectedCount props
  const count = selectedCount || selectedItems.length;
  const items = selectedItems;
  
  console.log('🔧 BulkActions render:', { count, itemsLength: items.length, actionsLength: actions.length });
  
  if (count === 0) return null;

  // Default actions if none provided (for backward compatibility)
  const defaultActions = [];
  if (onDelete) {
    defaultActions.push({
      label: "Delete",
      icon: "fas fa-trash",
      onClick: () => onDelete(items),
      className: "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
      title: "Delete selected items"
    });
  }
  if (onClearSelection) {
    defaultActions.push({
      label: "Clear",
      icon: "fas fa-times",
      onClick: () => onClearSelection(),
      className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-md",
      title: "Clear selection"
    });
  }

  const finalActions = actions.length > 0 ? actions : defaultActions;

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  return (
    <div className={`fixed ${positionClasses[position]} bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-700 z-50`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {count} {count === 1 ? entityName.slice(0, -1) : entityName} selected
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {finalActions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              console.log('🔧 BulkAction clicked:', action.label, 'with items:', items);
              action.onClick(items);
            }}
            className={action.className || "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"}
            disabled={action.disabled}
            title={action.title}
          >
            {action.icon && <i className={`${action.icon} ${action.label ? 'mr-2' : ''}`}></i>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BulkActions;