import React, { useState, useEffect, useContext } from "react";
import { useReviews } from "../../../Context/ReviewContext";
import { AppContent } from "../../../Context/AppContent";
import Button from "../../Common/Button";
import StarRating from "../../Common/StarRating";
import ReviewForm from "../../Common/ReviewForm";

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

function TabsContent({ activeTab, product }) {
  const { getProductReviews, canUserReview, deleteReview } = useReviews();
  const { isLoggedIn } = useContext(AppContent);
  const [reviewData, setReviewData] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userCanReview, setUserCanReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch reviews when tab becomes active
  useEffect(() => {
    if (activeTab === 'reviews' && product?.id) {
      fetchReviews();
      checkUserReviewEligibility();
    }
  }, [activeTab, product?.id, currentPage]);

  const fetchReviews = async () => {
    const result = await getProductReviews(product.id, {
      page: currentPage,
      limit: 5,
      sortBy: 'createdAt',
      order: 'desc'
    });

    if (result.success) {
      setReviewData(result.data);
    }
  };

  const checkUserReviewEligibility = async () => {
    if (isLoggedIn) {
      const result = await canUserReview(product.id);
      if (result.success) {
        setUserCanReview(result);
      }
    }
  };

  const handleReviewSubmitted = (review) => {
    setShowReviewForm(false);
    setEditingReview(null);
    fetchReviews();
    checkUserReviewEligibility();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const result = await deleteReview(reviewId);
      if (result.success) {
        fetchReviews();
        checkUserReviewEligibility();
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (activeTab === "description") {
    return (
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-6 text-text flex items-center">
          <i className="fas fa-info-circle mr-3 text-primary"></i>
          Product Description
        </h3>
        <div className="prose max-w-none text-text/90">
          <p className="mb-6 leading-relaxed">
            {product.longDescription || product.description}
          </p>
          
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-4 text-text">Key Features:</h4>
              <ul className="list-disc list-inside space-y-2 text-text/80">
                {product.specifications.slice(0, 5).map((spec, index) => (
                  <li key={index}>
                    <strong>{spec.name}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "specifications") {
    return (
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-6 text-text flex items-center">
          <i className="fas fa-cogs mr-3 text-primary"></i>
          Technical Specifications
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <tbody>
              {product.specifications && product.specifications.map((spec, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 font-medium text-text bg-gray-50 dark:bg-gray-700 w-1/3">
                    {spec.name}
                  </td>
                  <td className="py-3 px-4 text-text/80">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === "reviews") {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text flex items-center">
            <i className="fas fa-comments mr-3 text-primary"></i>
            Customer Reviews
            {reviewData?.summary?.totalReviews > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({reviewData.summary.totalReviews})
              </span>
            )}
          </h3>

          {/* Write Review Button */}
          {isLoggedIn && userCanReview?.canReview && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              variant="primary"
              size="sm"
              icon="fas fa-pen"
            >
              Write Review
            </Button>
          )}
        </div>

        {/* Review Summary - SIMPLIFIED */}
        {reviewData?.summary && reviewData.summary.totalReviews > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 mb-8">
            <div className="flex items-center justify-between">
              {/* Left Side - Overall Rating */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {reviewData.summary.averageRating}
                  </div>
                  <StarRating 
                    rating={reviewData.summary.averageRating} 
                    showText={false} 
                    size="md" 
                  />
                </div>
                
                <div>
                  <div className="text-lg font-semibold text-text">
                    {reviewData.summary.totalReviews} Review{reviewData.summary.totalReviews !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-text/70">
                    {reviewData.summary.recommendationPercentage}% recommend this product
                  </div>
                </div>
              </div>

              {/* Right Side - Most Recent Review */}
              {reviewData.summary.mostRecentDate && (
                <div className="text-right text-sm text-text/70">
                  <div>Most Recent: {formatDate(reviewData.summary.mostRecentDate)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={handleReviewSubmitted}
              existingReview={editingReview}
            />
          </div>
        )}

        {/* User Status Messages */}
        {!isLoggedIn && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg mb-6">
            <p className="text-blue-700 dark:text-blue-300">
              <i className="fas fa-info-circle mr-2"></i>
              Please <a href="/login" className="underline">login</a> to write a review.
            </p>
          </div>
        )}

        {userCanReview && !userCanReview.canReview && userCanReview.reason === 'already_reviewed' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg mb-6">
            <p className="text-green-700 dark:text-green-300">
              <i className="fas fa-check-circle mr-2"></i>
              Thank you for your review! You can edit it below.
            </p>
          </div>
        )}

        {/* Reviews List - Updated for simplified model */}
        {reviewData?.reviews && reviewData.reviews.length > 0 ? (
          <div className="space-y-6">
            {reviewData.reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <StarRating rating={review.rating} showText={false} size="sm" />
                      <div className="text-sm text-gray-500">
                        by {review.user_id?.name || review.user_id?.first_name || 'Anonymous'} • {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* User's own review actions */}
                  {userCanReview?.existingReview?._id === review._id && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditReview(review)}
                        variant="outline"
                        size="sm"
                        icon="fas fa-edit"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteReview(review._id)}
                        variant="danger"
                        size="sm"
                        icon="fas fa-trash"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                {/* Review Comment - Now the main content without title */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-text/80 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {reviewData.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {reviewData.pagination.totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(reviewData.pagination.totalPages, prev + 1))}
                  disabled={currentPage === reviewData.pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⭐</div>
            <h4 className="text-lg font-medium mb-2 text-text">
              No reviews yet
            </h4>
            <p className="text-text/70 mb-6">
              Be the first to review this product and help other customers make informed decisions.
            </p>
            
            {isLoggedIn && userCanReview?.canReview && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                variant="primary" 
                icon="fas fa-pen"
              >
                Write the First Review
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "shipping") {
    return (
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-6 text-text flex items-center">
          <i className="fas fa-shipping-fast mr-3 text-primary"></i>
          Shipping Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-text mb-2">
              <i className="fas fa-shipping-fast mr-2 text-primary"></i>
              Standard Shipping
            </h4>
            <p className="text-sm text-text/70 mb-2">5-7 business days</p>
            <p className="text-sm font-medium text-text">Free on orders over ₹99</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-text mb-2">
              <i className="fas fa-bolt mr-2 text-primary"></i>
              Express Shipping
            </h4>
            <p className="text-sm text-text/70 mb-2">2-3 business days</p>
            <p className="text-sm font-medium text-text">₹50</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-text mb-4">Return Policy</h4>
          <ul className="list-disc list-inside text-sm text-text/70 space-y-2">
            <li>30-day return window</li>
            <li>Items must be in original condition</li>
            <li>Free returns on defective items</li>
            <li>Return shipping costs may apply</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}

export default TabsContent;