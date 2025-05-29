import React, { useMemo } from "react";
import Loader from "./Loader";

const Table = ({
  data = [],
  columns = [],
  selectedItems = [],
  onSelect, // Legacy prop name (Users component)
  onSelectItem, // New prop name (Orders, Categories, Products, Reviews)
  onSelectAll,
  sortConfig,
  onSortChange,
  isLoading = false,
  emptyMessage = "No data available",
  enableSelection = false,
  enableSorting = false,
  itemKey = "id",
}) => {
  console.log('🔄 Table render with:', {
    dataLength: data.length,
    selectedItemsLength: selectedItems.length,
    enableSelection,
    hasOnSelect: !!onSelect,
    hasOnSelectItem: !!onSelectItem,
    hasOnSelectAll: !!onSelectAll
  });

  // Use either onSelect or onSelectItem (backward compatibility)
  const handleSelectItem = onSelect || onSelectItem;

  // Calculate if all items are selected
  const allSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.every((item) => selectedItems.includes(item[itemKey]));
  }, [data, selectedItems, itemKey]);

  // Calculate if some items are selected (for indeterminate state)
  const someSelected = useMemo(() => {
    if (selectedItems.length === 0) return false;
    return data.some((item) => selectedItems.includes(item[itemKey]));
  }, [data, selectedItems, itemKey]);

  const handleSelect = (itemId, selected) => {
    console.log('🔄 Table handleSelect called:', { itemId, selected });
    console.log('📋 Current selectedItems:', selectedItems);
    
    if (handleSelectItem) {
      handleSelectItem(itemId, selected);
    } else {
      console.log('⚠️ No selection handler provided (onSelect or onSelectItem)');
    }
  };

  const handleSelectAll = () => {
    console.log('🔄 Table handleSelectAll called, current state:', { allSelected, dataLength: data.length });
    console.log('📋 Current selectedItems:', selectedItems);
    
    if (onSelectAll) {
      console.log("Select all checkbox clicked, current state:", allSelected);
      console.log("Will change to:", !allSelected);
      onSelectAll(!allSelected);
    } else {
      console.log('⚠️ No onSelectAll handler provided');
    }
  };

  const handleSort = (columnKey) => {
    if (!enableSorting || !onSortChange) return;

    let direction = "ascending";
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    onSortChange({ key: columnKey, direction });
  };

  const getSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return "fas fa-sort text-gray-400";
    }
    return sortConfig.direction === "ascending"
      ? "fas fa-sort-up text-primary"
      : "fas fa-sort-down text-primary";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          <i className="fas fa-inbox text-4xl mb-4"></i>
          <p className="text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {/* Selection Header */}
              {enableSelection && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someSelected && !allSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                  />
                </th>
              )}

              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable && enableSorting ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                  } ${column.width ? column.width : ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{column.label}</span>
                    {column.sortable && enableSorting && (
                      <i className={getSortIcon(column.key)}></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => {
              const itemId = item[itemKey];
              const isSelected = selectedItems.includes(itemId);

              return (
                <tr
                  key={itemId || index}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  {/* Selection Cell */}
                  {enableSelection && (
                    <td className="px-6 py-4 whitespace-nowrap w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          console.log('📋 Checkbox clicked:', { itemId, checked: e.target.checked });
                          handleSelect(itemId, e.target.checked);
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 ${column.nowrap !== false ? "whitespace-nowrap" : ""} ${
                        column.className || ""
                      } ${column.maxWidth ? `max-w-${column.maxWidth}` : ""}`}
                    >
                      <div className={column.truncate ? "truncate" : ""}>
                        {column.customRenderer
                          ? column.customRenderer(item, index)
                          : item[column.key]}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;