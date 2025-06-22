import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { getReviewsTableConfig } from "../Common/tableConfig";
import { useAdmin } from '../../Context/AdminContext';
import ReviewModal from './components/ReviewModal';
import ReviewsSkeleton from './components/ReviewsSkeleton';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Reviews() {
  const { adminData } = useAdmin();
  const isAdmin = adminData?.role === 'admin';

  const checkAdminAccess = (action) => {
    if (isAdmin) {
      return true;
    } else {
      toast.error(`Access denied. Admin privileges required to ${action}.`);
      return false;
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
    }
  };

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

  useEffect(() => {
    fetchReviewStats();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, searchQuery, ratingFilter, sortConfig]);

  const deleteReview = async (reviewId) => {
    if (!checkAdminAccess('delete reviews')) return false;
    
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/reviews/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
        fetchReviewStats();
        return true;
      }
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      
      if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required to delete reviews.");
      } else {
        toast.error("Failed to delete review");
      }
      return false;
    }
  };

  const handleViewReview = (review) => {
    console.log("👁️ Viewing review:", review);
    setActiveReview(review);
    setShowModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const success = await deleteReview(reviewId);
      if (success) {
        fetchReviews();
      }
    }
  };

  const handleDelete = async (ids) => {
    if (
      window.confirm(
        `Delete ${ids.length > 1 ? "these reviews" : "this review"}?`
      )
    ) {
      if (!checkAdminAccess('delete reviews')) return;
      
      let successCount = 0;
      for (const id of ids) {
        const success = await deleteReview(id);
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} review(s) deleted successfully`);
        fetchReviews();
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

  // Add this condition at the beginning of the return statement
  if (isLoading && reviews.length === 0) {
    return <ReviewsSkeleton />;
  }

  return (
    <div className="p-6 bg-background min-h-screen">
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

      {/* Stats Cards - Static, no click handlers */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {Object.entries(reviewCounts).map(([rating, count]) => (
          <div
            key={rating}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
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
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : parseInt(rating) >= 4
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : parseInt(rating) === 3
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
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

      {/* Search and Filter Controls */}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-600 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-600 dark:text-white"
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
        <div className="overflow-x-auto">
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
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={totalReviews}
          handlePageChange={setPage}
          handleRowsPerPageChange={(newRowsPerPage) => {
            console.log('📝 Reviews: Changing rows per page to:', newRowsPerPage);
            setRowsPerPage(parseInt(newRowsPerPage, 10));
            setPage(0);
          }}
          entityName="reviews"
        />
      </div>

      {/* Review Modal Component */}
      <ReviewModal
        showModal={showModal}
        activeReview={activeReview}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default Reviews;
