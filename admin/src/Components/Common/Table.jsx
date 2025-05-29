import React, { useState } from "react";

const Table = ({
  data = [],
  columns = [],
  selectedItems = [],
  onSelect,
  onSelectAll,
  onAction,
  itemKey = "id",
  tableType = "generic", // "orders", "products", "users", or "generic"
  customRenderers = {}, // For custom cell rendering
  enableSelection = true,
  enableSorting = true,
  sortConfig = { key: null, direction: "ascending" },
  onSortChange,
  emptyMessage = "No items found",
  isLoading = false,
}) => {
  // Internal sort state if no external control is provided
  const [internalSortConfig, setInternalSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Use provided sort config or internal one
  const currentSortConfig = onSortChange ? sortConfig : internalSortConfig;

  // Request sort function
  const requestSort = (key) => {
    let direction = "ascending";
    if (currentSortConfig.key === key && currentSortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    if (onSortChange) {
      onSortChange({ key, direction });
    } else {
      setInternalSortConfig({ key, direction });
    }
  };

  // Helper for sort indicator icon
  const getSortDirectionIcon = (name) => {
    if (currentSortConfig.key !== name) {
      return <i className="fas fa-sort text-gray-300 ml-1"></i>;
    }
    return currentSortConfig.direction === "ascending" ? (
      <i className="fas fa-sort-up text-primary ml-1"></i>
    ) : (
      <i className="fas fa-sort-down text-primary ml-1"></i>
    );
  };

  // Improved check for "all selected" state
  const allSelected = 
    data.length > 0 && 
    selectedItems.length >= data.length && 
    data.every(item => selectedItems.includes(item[itemKey]));

  // Handle selection of all items with better logging
  const handleSelectAll = () => {
    if (onSelectAll) {
      console.log("Select all checkbox clicked, current state:", allSelected);
      console.log("Will change to:", !allSelected);
      onSelectAll(!allSelected);
    }
  };

  // Handle selection of a single item
  const handleSelect = (itemId, selected) => {
    if (onSelect) {
      onSelect(itemId, selected);
    }
  };

  // Format cell content based on column type and data
  const formatCellContent = (item, column) => {
    // 🔥 Check for custom renderer first
    if (column.customRenderer) {
      return column.customRenderer(item);
    }

    // 🔥 Check for customRenderers prop (legacy support)
    if (customRenderers[column.key]) {
      return customRenderers[column.key](item);
    }

    const value = item[column.key];

    switch (column.type) {
      case "currency":
        return value ? `₹${parseFloat(value).toLocaleString('en-IN')}` : '₹0';
      
      case "date":
        return value ? new Date(value).toLocaleDateString('en-IN') : '-';
      
      case "status":
        const statusColor = column.getStatusColor ? column.getStatusColor(value) : '';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {value}
          </span>
        );
      
      case "actions":
        return (
          <div className="flex items-center space-x-2">
            {column.actions?.map((action, index) => (
              <button
                key={index}
                onClick={() => action.onClick(item.id)}
                className={`${action.className} hover:scale-110 transition-transform`}
                title={action.title}
              >
                <i className={action.icon}></i>
              </button>
            ))}
          </div>
        );
      
      default:
        // 🔥 FIX: Return the actual value, not value || '-'
        return value !== undefined && value !== null ? value : '-';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {enableSelection && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase ${
                  enableSorting && column.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (enableSorting && column.sortable) {
                    requestSort(column.key);
                  }
                }}
              >
                <div className="flex items-center">
                  {column.label}
                  {enableSorting && column.sortable && getSortDirectionIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td 
                colSpan={enableSelection ? columns.length + 1 : columns.length} 
                className="px-6 py-8 text-center"
              >
                <div className="flex justify-center items-center">
                  <i className="fas fa-spinner fa-spin text-primary mr-2"></i>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item[itemKey]}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {enableSelection && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item[itemKey])}
                      onChange={(e) => handleSelect(item[itemKey], e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td 
                    key={`${item[itemKey]}-${column.key}`} 
                    className={`px-6 py-4 ${column.className || ""}`}
                  >
                    {formatCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={enableSelection ? columns.length + 1 : columns.length} 
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;