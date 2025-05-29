const Review = require('../models/review.model');
const Product = require('../models/product.model');
const User = require('../models/User.model');

// Create a new review
const createReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { product_id, rating, comment } = req.body;

        // Validate required fields (removed title)
        if (!product_id || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (product_id, rating, comment)'
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product_id: product_id,
            user_id: userId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Create review (simplified - no title, no verified_purchase)
        const review = new Review({
            product_id,
            user_id: userId,
            rating,
            comment: comment.trim()
        });

        const savedReview = await review.save();

        // Update product rating
        await updateProductRating(product_id);

        // Populate user data for response
        const populatedReview = await Review.findById(savedReview._id)
            .populate('user_id', 'name first_name last_name email')
            .populate('product_id', 'product_name');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        });

    } catch (error) {
        console.error('Create review error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get reviews for a specific product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Get paginated reviews
    const reviews = await Review.find({ product_id: productId })
      .populate('user_id', 'first_name last_name name')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    // Get total count and complete summary (not just current page)
    const totalReviews = await Review.countDocuments({ product_id: productId });
    
    // Calculate complete summary statistics - SIMPLE VERSION
    const allReviews = await Review.find({ product_id: productId });
    
    let summary = {
      totalReviews: 0,
      averageRating: 0,
      recommendationPercentage: 0
    };

    if (allReviews.length > 0) {
      // Calculate average rating
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      summary.averageRating = Number((totalRating / allReviews.length).toFixed(1));
      
      // Calculate recommendation percentage (4+ stars)
      const positiveReviews = allReviews.filter(review => review.rating >= 4).length;
      summary.recommendationPercentage = Math.round((positiveReviews / allReviews.length) * 100);
      
      summary.totalReviews = allReviews.length;
    }

    // Get most recent review date
    const mostRecentReview = allReviews.length > 0 
      ? allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    res.json({
      success: true,
      data: {
        reviews,
        summary: {
          ...summary,
          mostRecentDate: mostRecentReview ? mostRecentReview.createdAt : null
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNextPage: page < Math.ceil(totalReviews / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ user_id: userId })
            .populate('product_id', 'product_name product_image product_price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments({ user_id: userId });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews
                }
            }
        });

    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews'
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { reviewId } = req.params;
        const { rating, comment } = req.body; // Removed title

        // Find review and check ownership
        const review = await Review.findOne({
            _id: reviewId,
            user_id: userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you are not authorized to update it'
            });
        }

        // Update fields
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment.trim();
        }

        const updatedReview = await review.save();

        // Update product rating if rating changed
        if (rating !== undefined) {
            await updateProductRating(review.product_id);
        }

        // Populate for response
        const populatedReview = await Review.findById(updatedReview._id)
            .populate('user_id', 'name first_name last_name')
            .populate('product_id', 'product_name');

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: populatedReview
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update review'
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { reviewId } = req.params;

        // Find review and check ownership
        const review = await Review.findOne({
            _id: reviewId,
            user_id: userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you are not authorized to delete it'
            });
        }

        const productId = review.product_id;

        await Review.findByIdAndDelete(reviewId);

        // Update product rating
        await updateProductRating(productId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
};

// Helper function to update product rating (updated to match new schema)
const updateProductRating = async (productId) => {
    try {
        const result = await Review.aggregate([
            {
                $match: {
                    product_id: productId
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        const averageRating = result.length > 0 ? result[0].averageRating : 0;
        const totalReviews = result.length > 0 ? result[0].totalReviews : 0;

        // Update to match the new flat structure
        await Product.findByIdAndUpdate(productId, {
            product_rating: Math.round(averageRating * 10) / 10,
            review_count: totalReviews
        });

        console.log(`Updated product ${productId} rating to ${averageRating}`);
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
};

// Check if user can review a product
const canUserReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product_id: productId,
            user_id: userId
        });

        if (existingReview) {
            return res.json({
                success: true,
                canReview: false,
                reason: 'already_reviewed',
                existingReview: existingReview
            });
        }

        // Allow all logged-in users to review
        res.json({
            success: true,
            canReview: true
        });

    } catch (error) {
        console.error('Can user review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check review eligibility'
        });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    canUserReview
};