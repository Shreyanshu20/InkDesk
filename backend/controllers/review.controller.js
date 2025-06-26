const Review = require('../models/review.model');
const Product = require('../models/product.model');

// ========== REVIEW MANAGEMENT CONTROLLER FUNCTIONS ==========//
module.exports.createReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { product_id, rating, comment } = req.body;

        if (!product_id || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (product_id, rating, comment)'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

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

        const review = new Review({
            product_id,
            user_id: userId,
            rating,
            comment: comment.trim()
        });

        const savedReview = await review.save();

        await updateProductRating(product_id);

        const populatedReview = await Review.findById(savedReview._id)
            .populate('user_id', 'name first_name last_name email')
            .populate('product_id', 'product_name');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        });

    } catch (error) {
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

module.exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const reviews = await Review.find({ product_id: productId })
            .populate('user_id', 'first_name last_name name')
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments({ product_id: productId });

        const allReviews = await Review.find({ product_id: productId });

        let summary = {
            totalReviews: 0,
            averageRating: 0,
            recommendationPercentage: 0
        };

        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            summary.averageRating = Number((totalRating / allReviews.length).toFixed(1));

            const positiveReviews = allReviews.filter(review => review.rating >= 4).length;
            summary.recommendationPercentage = Math.round((positiveReviews / allReviews.length) * 100);

            summary.totalReviews = allReviews.length;
        }

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
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

module.exports.getUserReviews = async (req, res) => {
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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews'
        });
    }
};

module.exports.updateReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

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

        if (rating !== undefined) {
            await updateProductRating(review.product_id);
        }

        const populatedReview = await Review.findById(updatedReview._id)
            .populate('user_id', 'name first_name last_name')
            .populate('product_id', 'product_name');

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: populatedReview
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review'
        });
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { reviewId } = req.params;

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

        await updateProductRating(productId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
};

//utility function to update product rating and review count (used internally)
module.exports.updateProductRating = async (productId) => {
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

        await Product.findByIdAndUpdate(productId, {
            product_rating: Math.round(averageRating * 10) / 10,
            review_count: totalReviews
        });

    } catch (error) {
        // Silent error handling
    }
};

module.exports.canUserReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;

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

        res.json({
            success: true,
            canReview: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check review eligibility'
        });
    }
};