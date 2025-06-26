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
      <div className="p-4 md:p-6 lg:p-8">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 text-text flex items-center">
          <i className="fas fa-info-circle mr-2 md:mr-3 text-primary"></i>
          Product Description
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm md:text-base lg:text-lg text-text/80 leading-relaxed mb-4 md:mb-6">
            {product.longDescription || product.description}
          </p>
          
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-text">Key Features:</h4>
              <ul className="list-disc list-inside space-y-2 text-text/80">
                {product.specifications.slice(0, 5).map((spec, index) => (
                  <li key={index} className="text-sm md:text-base">
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
      <div className="p-4 md:p-6 lg:p-8">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 text-text flex items-center">
          <i className="fas fa-cogs mr-2 md:mr-3 text-primary"></i>
          Product Specifications
        </h3>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <tbody>
              {product.specifications && product.specifications.map((spec, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <td className="py-3 md:py-4 px-3 md:px-6 text-sm md:text-base font-semibold text-text bg-gray-200 dark:bg-gray-700 w-1/3">
                    {spec.name}
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6 text-sm md:text-base text-text/80">
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
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text flex items-center">
            <i className="fas fa-comments mr-2 md:mr-3 text-primary"></i>
            Customer Reviews
            {reviewData?.summary?.totalReviews > 0 && (
              <span className="ml-2 md:ml-3 text-sm md:text-base font-normal text-gray-500 dark:text-gray-400">
                ({reviewData.summary.totalReviews})
              </span>
            )}
          </h3>

          {isLoggedIn && userCanReview?.canReview && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              variant="primary"
              size="md"
              icon="fas fa-pen"
            >
              Write Review
            </Button>
          )}
        </div>

        {reviewData?.summary && reviewData.summary.totalReviews > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">
                    {reviewData.summary.averageRating}
                  </div>
                  <StarRating 
                    rating={reviewData.summary.averageRating} 
                    showText={false} 
                    size="lg" 
                  />
                </div>
                
                <div>
                  <div className="text-base md:text-xl font-bold text-text mb-1">
                    {reviewData.summary.totalReviews} Review{reviewData.summary.totalReviews !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {reviewData.summary.recommendationPercentage}% recommend this product
                  </div>
                </div>
              </div>

              {reviewData.summary.mostRecentDate && (
                <div className="text-right text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  <div>Most Recent: {formatDate(reviewData.summary.mostRecentDate)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {showReviewForm && (
          <div className="mb-6 md:mb-8">
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={handleReviewSubmitted}
              existingReview={editingReview}
            />
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 md:p-4 rounded-xl mb-4 md:mb-6">
            <p className="text-blue-800 dark:text-blue-300 text-sm md:text-base">
              <i className="fas fa-info-circle mr-2"></i>
              Please <a href="/login" className="underline font-medium">login</a> to write a review.
            </p>
          </div>
        )}

        {reviewData?.reviews && reviewData.reviews.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {reviewData.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-3 md:gap-4 mb-2">
                      <StarRating rating={review.rating} showText={false} size="md" />
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        by {review.user_id?.name || review.user_id?.first_name || 'Anonymous'} • {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

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

                <p className="text-sm md:text-base text-text/80 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}

            {reviewData.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 md:gap-4 mt-6 md:mt-8">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="md"
                >
                  Previous
                </Button>
                
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 px-2 md:px-4">
                  Page {currentPage} of {reviewData.pagination.totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(reviewData.pagination.totalPages, prev + 1))}
                  disabled={currentPage === reviewData.pagination.totalPages}
                  variant="outline"
                  size="md"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">⭐</div>
            <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-text">
              No reviews yet
            </h4>
            <p className="text-sm md:text-base text-text/70 mb-6 md:mb-8 max-w-md mx-auto">
              Be the first to review this product and help other customers make informed decisions.
            </p>
            
            {isLoggedIn && userCanReview?.canReview && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                variant="primary" 
                icon="fas fa-pen"
                size="md"
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
      <div className="p-4 md:p-6 lg:p-8">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 text-text flex items-center">
          <i className="fas fa-shipping-fast mr-2 md:mr-3 text-primary"></i>
          Shipping Information
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 md:p-6 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
              <i className="fas fa-truck text-blue-600 dark:text-blue-400 text-lg md:text-xl"></i>
              <h4 className="text-sm md:text-base font-bold text-blue-900 dark:text-blue-300">Free Shipping</h4>
            </div>
            <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300">On orders over ₹99. Delivery in 5-7 business days.</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 md:p-6 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
              <i className="fas fa-bolt text-green-600 dark:text-green-400 text-lg md:text-xl"></i>
              <h4 className="text-sm md:text-base font-bold text-green-900 dark:text-green-300">Express Delivery</h4>
            </div>
            <p className="text-xs md:text-sm text-green-800 dark:text-green-300">Get your order in 2-3 business days for ₹99.</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
              <i className="fas fa-undo text-gray-600 dark:text-gray-400 text-lg md:text-xl"></i>
              <h4 className="text-sm md:text-base font-bold text-text">Easy Returns</h4>
            </div>
            <p className="text-xs md:text-sm text-text/80">10-day return policy. Free return shipping.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default TabsContent;