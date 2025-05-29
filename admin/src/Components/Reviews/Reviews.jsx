import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { getReviewsTableConfig } from "../Common/tableConfig";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const [activeReview, setActiveReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("limit", rowsPerPage);
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      if (ratingFilter !== "all") {
        params.append("rating", ratingFilter);
      }

      const response = await axios.get(`${API_BASE_URL}/admin/reviews?${params.toString()}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const transformedReviews = response.data.reviews.map((review) => ({
          id: review._id,
          content: review.comment,
          rating: review.rating,
          date: review.createdAt,
          customer: {
            id: review.user_id?._id,
            name: review.user_id?.first_name 
              ? `${review.user_id.first_name} ${review.user_id.last_name || ''}`.trim()
              : 'Anonymous User',
            email: review.user_id?.email || 'N/A',
            avatar: review.user_id?.avatar || null
          },
          product: {
            id: review.product_id?._id,
            name: review.product_id?.product_name || 'Unknown Product',
            image: review.product_id?.product_image || null,
            category: review.product_id?.category || 'Uncategorized'
          }
        }));

        setReviews(transformedReviews);
        setTotalReviews(response.data.pagination?.total || transformedReviews.length);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
      setTotalReviews(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews on component mount and when filters change
  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, searchQuery, ratingFilter]);

  // Delete review
  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success("Review deleted successfully");
        return true;
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    }
  };

  // Handle View Review Action
  const handleViewReview = (review) => {
    setActiveReview(review);
    setShowModal(true);
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const success = await deleteReview(reviewId);
      if (success) {
        fetchReviews(); // Refresh the list
      }
    }
  };

  // Handle bulk delete
  const handleDelete = async (ids) => {
    if (window.confirm(`Delete ${ids.length > 1 ? "these reviews" : "this review"}?`)) {
      let successCount = 0;
      for (const id of ids) {
        const success = await deleteReview(id);
        if (success) successCount++;
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} review(s) deleted successfully`);
        fetchReviews(); // Refresh the list
        setSelectedReviews([]);
      }
    }
  };

  // Helper function for rating stars display
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

  // Handle selection
  const handleSelectReview = (id, selected) => {
    setSelectedReviews(
      selected
        ? [...selectedReviews, id]
        : selectedReviews.filter((reviewId) => reviewId !== id)
    );
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedReviews(reviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  // Review counts by rating
  const reviewCounts = useMemo(() => {
    const counts = {
      all: reviews.length,
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };
    return counts;
  }, [reviews]);

  // Sorted reviews based on sort config
  const sortedReviews = useMemo(() => {
    if (!sortConfig.key) return reviews;
    
    return [...reviews].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === "rating") {
        aValue = a.rating;
        bValue = b.rating;
      } else if (sortConfig.key === "date") {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [reviews, sortConfig]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Product Reviews
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage customer reviews ({totalReviews} total reviews)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Ratings ({reviewCounts.all})</option>
              <option value="5">5 Stars ({reviewCounts[5]})</option>
              <option value="4">4 Stars ({reviewCounts[4]})</option>
              <option value="3">3 Stars ({reviewCounts[3]})</option>
              <option value="2">2 Stars ({reviewCounts[2]})</option>
              <option value="1">1 Star ({reviewCounts[1]})</option>
            </select>
          </div>

          <button
            onClick={fetchReviews}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <i className="fas fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <BulkActions
          selectedCount={selectedReviews.length}
          onDelete={() => handleDelete(selectedReviews)}
          onClearSelection={() => setSelectedReviews([])}
        />
      )}

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden">
        <Table
          data={sortedReviews}
          columns={getReviewsTableConfig({
            onView: handleViewReview,
            onDelete: handleDeleteReview,
          }).columns}
          selectedItems={selectedReviews}
          onSelect={handleSelectReview}
          onSelectAll={handleSelectAll}
          sortConfig={sortConfig}
          onSortChange={(key) => {
            setSortConfig({
              key,
              direction:
                sortConfig.key === key && sortConfig.direction === "ascending"
                  ? "descending"
                  : "ascending",
            });
          }}
          isLoading={isLoading}
          emptyMessage="No reviews found"
          isSelectable={true}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={totalReviews}
          handlePageChange={setPage}
          handleRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          entityName="reviews"
        />
      </div>
      
      {/* Review Detail Modal */}
      {showModal && activeReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Review Details
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
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
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeReview.customer.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeReview.customer.email}
                  </p>
                </div>
                <div className="ml-auto flex items-center">
                  <div className="flex mr-2">
                    {renderRatingStars(activeReview.rating)}
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
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
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeReview.product.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {activeReview.product.category}
                  </div>
                </div>
              </div>
              
              {/* Review Content */}
              <div className="mb-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Review Comment
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {activeReview.content}
                </p>
              </div>
              
              {/* Date */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Submitted on {new Date(activeReview.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                })}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;