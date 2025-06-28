import React from "react";

const ReviewModal = ({ showModal, activeReview, onClose }) => {
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        <span className="text-lg font-medium mr-2">{rating}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (!showModal || !activeReview) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Review Details
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex justify-center items-center hover:bg-gray-600 text-gray-400 rounded-md focus:outline-none transition-colors duration-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {activeReview.customer.avatar ? (
                <img
                  src={activeReview.customer.avatar}
                  alt={activeReview.customer.name}
                  className="h-12 w-12 object-cover"
                />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center bg-primary/10">
                  <span className="text-primary font-semibold">
                    {activeReview.customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {activeReview.customer.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeReview.customer.email}
              </p>
            </div>
            <div className="flex items-center">
              {renderRatingStars(activeReview.rating)}
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md mb-4">
            <div className="h-10 w-10 flex-shrink-0">
              {activeReview.product.image ? (
                <img
                  src={activeReview.product.image}
                  alt={activeReview.product.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <i className="fas fa-box text-gray-400"></i>
                </div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activeReview.product.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {activeReview.product.category}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Review Comment
            </h4>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {activeReview.content}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Submitted on{" "}
            {new Date(activeReview.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
