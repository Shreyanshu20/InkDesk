import React from "react";

const StatusUpdateModal = ({
  statusModalOpen,
  selectedOrderForStatus,
  closeStatusModal,
  orderStatuses,
  handleStatusUpdate,
  getStatusColor,
}) => {
  if (!statusModalOpen || !selectedOrderForStatus) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Order Status
          </h3>
          <button
            onClick={closeStatusModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Order: #{
              selectedOrderForStatus.order_number ||
              selectedOrderForStatus.id.slice(-8).toUpperCase()
            }
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Customer: {selectedOrderForStatus.customer?.name}
          </p>

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Status:
            </span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                selectedOrderForStatus.status
              )}`}
            >
              {selectedOrderForStatus.status}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select New Status:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {orderStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={status === selectedOrderForStatus.status}
                className={`p-3 rounded-md border text-left transition-colors ${
                  status === selectedOrderForStatus.status
                    ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize font-medium text-gray-900 dark:text-white">
                    {status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={closeStatusModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;