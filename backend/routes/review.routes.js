const express = require('express');
const router = express.Router();
const {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    canUserReview
} = require('../controllers/review.controller');
const { userAuth } = require('../middleware/userAuth');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(userAuth);

// Create review
router.post('/create', createReview);

// Get user's reviews
router.get('/my-reviews', getUserReviews);

// Update review
router.put('/:reviewId', updateReview);

// Delete review
router.delete('/:reviewId', deleteReview);

// Check if user can review a product
router.get('/can-review/:productId', canUserReview);

module.exports = router;