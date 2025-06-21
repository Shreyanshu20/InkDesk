import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { getReviewsTableConfig } from "../Common/tableConfig";
import { useAdmin } from '../../Context/AdminContext';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Reviews() {
  const { adminData } = useAdmin(); // Get current user from context
  const isAdmin = adminData?.role === 'admin';

  // Add role check function
  const checkAdminAccess = (action) => {
    if (isAdmin) {
      return true; // Admin can do everything
    } else {
      toast.error(`Access denied. Admin privileges required to ${action}.`);
      return false; // User is restricted
    }
  };

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [totalReviews, setTotalReviews] = useState(0);

  // FIX: Initialize reviewStats with proper default structure
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    rating5: 0,
    rating4: 0,
    rating3: 0,
    rating2: 0,
    rating1: 0,
    averageRating: 0
  });

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  const [activeReview, setActiveReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ADD: Fetch review statistics (separate from paginated reviews)
  const fetchReviewStats = async () => {
    try {
      console.log("📊 Fetching review statistics...");

      const response = await axios.get(`${API_BASE_URL}/admin/reviews/stats`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setReviewStats(response.data.stats);
        console.log("📊 Review stats loaded:", response.data.stats);
      }
    } catch (error) {
      console.error("❌ Error fetching review stats:", error);
      // Keep default empty stats on error
    }
  };

  // Fetch reviews from backend (existing function - no changes needed)
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

      // Add sorting parameters
      if (sortConfig.key) {
        params.append("sortBy", sortConfig.key);
        params.append(
          "sortOrder",
          sortConfig.direction === "ascending" ? "asc" : "desc"
        );
      }

      console.log("🔍 Fetching reviews with params:", params.toString());

      const response = await axios.get(
        `${API_BASE_URL}/admin/reviews?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("📝 Reviews response:", response.data);

        const transformedReviews = response.data.reviews.map((review) => ({
          id: review._id,
          content: review.comment,
          rating: review.rating,
          date: review.createdAt,
          customer: {
            id: review.user_id?._id,
            name: review.user_id?.first_name
              ? `${review.user_id.first_name} ${
                  review.user_id.last_name || ""
                }`.trim()
              : "Anonymous User",
            email: review.user_id?.email || "N/A",
            avatar: review.user_id?.avatar || null,
          },
          product: {
            id: review.product_id?._id,
            name: review.product_id?.product_name || "Unknown Product",
            image: review.product_id?.product_image || null,
            category: review.product_id?.category || "Uncategorized",
          },
        }));

        setReviews(transformedReviews);
        setTotalReviews(
          response.data.pagination?.totalReviews || transformedReviews.length
        );

        console.log(
          `📊 Loaded ${transformedReviews.length} reviews of ${response.data.pagination?.totalReviews} total`
        );
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
      setTotalReviews(0);
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFY: Load both stats and reviews on mount
  useEffect(() => {
    fetchReviewStats(); // Load stats once
  }, []); // Only run once on mount

  // Fetch reviews when filters change
  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, searchQuery, ratingFilter, sortConfig]);

  // DELETE review function (existing code...)
  const deleteReview = async (reviewId) => {
    if (!checkAdminAccess('delete reviews')) return false; // Add role check
    
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/reviews/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Review deleted successfully");

        // Refresh both reviews and stats
        fetchReviews();
        fetchReviewStats();

        return true;
      }
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required to delete reviews.");
      } else {
        toast.error("Failed to delete review");
      }
      return false;
    }
  };

  // ADD: Missing selection handlers
  const handleViewReview = (review) => {
    console.log("👁️ Viewing review:", review);
    setActiveReview(review);
    setShowModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    // Don't check role here - let user click and see confirm dialog
    if (window.confirm("Are you sure you want to delete this review?")) {
      const success = await deleteReview(reviewId); // Role check happens inside deleteReview
      if (success) {
        fetchReviews(); // Refresh the list
      }
    }
  };

  const handleDelete = async (ids) => {
    // Don't check role here - let user click and see confirm dialog
    if (
      window.confirm(
        `Delete ${ids.length > 1 ? "these reviews" : "this review"}?`
      )
    ) {
      if (!checkAdminAccess('delete reviews')) return; // Check here after confirmation
      
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

  const handleSelectReview = (id, selected) => {
    console.log("📝 Review selection:", { id, selected });
    console.log("📋 Current selectedReviews before:", selectedReviews);

    if (selected) {
      const newSelected = [...selectedReviews, id];
      setSelectedReviews(newSelected);
      console.log("📋 New selectedReviews after adding:", newSelected);
    } else {
      const newSelected = selectedReviews.filter((reviewId) => reviewId !== id);
      setSelectedReviews(newSelected);
      console.log("📋 New selectedReviews after removing:", newSelected);
    }
  };

  const handleSelectAllReviews = (selected) => {
    console.log("📝 Select all reviews:", {
      selected,
      reviewCount: sortedReviews.length,
    });

    if (selected) {
      const allReviewIds = sortedReviews.map((review) => review.id);
      setSelectedReviews(allReviewIds);
      console.log("📋 Selected all reviews:", allReviewIds);
    } else {
      setSelectedReviews([]);
      console.log("📋 Cleared all selections");
    }
  };

  // ADD: Helper function for rating stars display
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

  // ADD: Missing sortedReviews useMemo
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

  // FIX: Use the correct field names from the stats response
  const reviewCounts = useMemo(() => {
    return {
      all: reviewStats.total || 0,
      5: reviewStats.rating5 || 0,
      4: reviewStats.rating4 || 0,
      3: reviewStats.rating3 || 0,
      2: reviewStats.rating2 || 0,
      1: reviewStats.rating1 || 0,
    };
  }, [reviewStats]);

  // MODIFY: Update header to use correct total
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Product Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage customer reviews ({reviewStats.total} total reviews)
          {reviewStats.averageRating > 0 && (
            <> • Average Rating: {Number(reviewStats.averageRating).toFixed(1)}/5.0</>
          )}
        </p>
      </div>

      {/* Stats Cards - Now using real stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {Object.entries(reviewCounts).map(([rating, count]) => (
          <div
            key={rating}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${
              ratingFilter === rating ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setRatingFilter(rating)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {rating === "all"
                    ? "All"
                    : `${rating} Star${rating !== "1" ? "s" : ""}`}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
              </div>
              <div
                className={`p-2 rounded-full ${
                  rating === "all"
                    ? "bg-blue-100 text-blue-600"
                    : parseInt(rating) >= 4
                    ? "bg-green-100 text-green-600"
                    : parseInt(rating) === 3
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {rating === "all" ? (
                  <i className="fas fa-star"></i>
                ) : (
                  <span className="text-xs font-bold">{rating}★</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD: Refresh button to update stats */}
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
            onClick={() => {
              fetchReviews();
              fetchReviewStats();
            }}
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
          selectedItems={selectedReviews}
          actions={[
            {
              label: "Delete Selected",
              icon: "fas fa-trash",
              onClick: (selectedIds) => handleDelete(selectedIds),
              className:
                "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              title: "Delete selected reviews",
            },
          ]}
          entityName="reviews"
          position="bottom-right"
        />
      )}

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Table
          data={sortedReviews}
          columns={
            getReviewsTableConfig({
              onView: handleViewReview,
              onDelete: handleDeleteReview,
            }).columns
          }
          selectedItems={selectedReviews}
          onSelectItem={handleSelectReview}
          onSelectAll={handleSelectAllReviews}
          sortConfig={sortConfig}
          onSortChange={({ key, direction }) => {
            setSortConfig({ key, direction });
          }}
          isLoading={isLoading}
          emptyMessage="No reviews found"
          enableSelection={true}
          enableSorting={true}
          itemKey="id"
        />

        {/* Pagination */}
        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={totalReviews}
          handlePageChange={setPage}
          handleRowsPerPageChange={(newRowsPerPage) => {
            console.log('📝 Reviews: Changing rows per page to:', newRowsPerPage);
            setRowsPerPage(parseInt(newRowsPerPage, 10)); // ✅ Convert to number
            setPage(0);
          }}
          entityName="reviews"
        />
      </div>

      {/* Review Detail Modal */}
      {showModal && activeReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
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

            {/* Modal Content - Scrollable */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
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
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {activeReview.content}
                  </p>
                </div>
              </div>

              {/* Date */}
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
