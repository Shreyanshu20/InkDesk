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
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
      onClick={closeStatusModal}
    >
      <div
        className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Update Order Status</h3>
          <button
            onClick={closeStatusModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Order #{selectedOrderForStatus.id} - {selectedOrderForStatus.customer.name}
        </p>

        <div className="space-y-3">
          {orderStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${
                selectedOrderForStatus.status === status
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block w-3 h-3 rounded-full mr-3 ${getStatusColor(
                  status
                )}`}
              ></span>
              <span className="text-sm">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {selectedOrderForStatus.status === status && (
                <i className="fas fa-check ml-auto text-primary"></i>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={closeStatusModal}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;