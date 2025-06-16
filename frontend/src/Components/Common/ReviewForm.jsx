import React, { useState } from "react";
import { useReviews } from "../../Context/ReviewContext";
import StarRating from "./StarRating";
import Button from "./Button";

const ReviewForm = ({
  productId,
  onReviewSubmitted,
  existingReview = null,
}) => {
  const { createReview, updateReview, loading } = useReviews();
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 5,
    comment: existingReview?.comment || "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      return;
    }

    const reviewData = {
      product_id: productId,
      rating: formData.rating,
      comment: formData.comment.trim(),
    };

    let result;
    if (existingReview) {
      result = await updateReview(existingReview._id, reviewData);
    } else {
      result = await createReview(reviewData);
    }

    if (result.success) {
      if (!existingReview) {
        setFormData({ rating: 5, comment: "" });
      }
      onReviewSubmitted && onReviewSubmitted(result.review);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-600"
    >
      <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-900 dark:text-white">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      <div className="mb-4 md:mb-6">
        <label className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
          Your Rating *
        </label>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-xl md:text-2xl transition-colors hover:scale-110 ${
                  star <= (hoveredRating || formData.rating)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingClick(star)}
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              >
                <i className="fas fa-star"></i>
              </button>
            ))}
          </div>
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-1 md:ml-2">
            {formData.rating} star{formData.rating !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-1 md:mt-2 text-xs text-gray-500 dark:text-gray-400">
          {formData.rating === 1 && "Poor - Very dissatisfied"}
          {formData.rating === 2 && "Fair - Somewhat dissatisfied"}
          {formData.rating === 3 && "Good - Satisfied"}
          {formData.rating === 4 && "Very Good - Very satisfied"}
          {formData.rating === 5 && "Excellent - Extremely satisfied"}
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <label
          htmlFor="comment"
          className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your Review *
        </label>
        <textarea
          id="comment"
          value={formData.comment}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, comment: e.target.value }))
          }
          placeholder="Share your experience with this product. What did you like or dislike? How was the quality, shipping, or customer service?"
          rows="5"
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical text-sm md:text-base"
          maxLength={1000}
          required
        />
        <div className="flex justify-between items-center mt-1 md:mt-2">
          <div className="text-xs text-gray-500">
            {formData.comment.length}/1000 characters
          </div>
          <div className="text-xs text-gray-500">
            {formData.comment.length < 20
              ? `${20 - formData.comment.length} more characters recommended`
              : "Good length!"}
          </div>
        </div>
      </div>

      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h4 className="text-sm md:text-base font-medium text-blue-700 dark:text-blue-300 mb-2">
          <i className="fas fa-lightbulb mr-2"></i>
          Review Guidelines
        </h4>
        <ul className="text-xs md:text-sm text-blue-600 dark:text-blue-400 space-y-1">
          <li>• Be honest and helpful to other customers</li>
          <li>• Focus on the product features and your experience</li>
          <li>• Avoid inappropriate language or personal information</li>
          <li>• Share specific details about quality, shipping, or service</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={
            loading ||
            !formData.comment.trim() ||
            formData.comment.trim().length < 10
          }
          className="px-4 md:px-6 flex-1"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              {existingReview ? "Updating..." : "Submitting..."}
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane mr-2"></i>
              {existingReview ? "Update Review" : "Submit Review"}
            </>
          )}
        </Button>

        {existingReview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onReviewSubmitted && onReviewSubmitted(null)}
            className="px-4 md:px-6 md:w-auto"
          >
            Cancel
          </Button>
        )}
      </div>

      {formData.comment.trim().length > 0 &&
        formData.comment.trim().length < 10 && (
          <div className="mt-3 text-sm text-orange-600 dark:text-orange-400">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Please write at least 10 characters for a helpful review.
          </div>
        )}
    </form>
  );
};

export default ReviewForm;
