const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

const { userAuth } = require('../middleware/userAuth');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes
router.use(userAuth);

// Create review
router.post('/create', reviewController.createReview);

// Get user's reviews
router.get('/my-reviews', reviewController.getUserReviews);

// Update review
router.put('/:reviewId', reviewController.updateReview);

// Delete review
router.delete('/:reviewId', reviewController.deleteReview);

// Check if user can review a product
router.get('/can-review/:productId', reviewController.canUserReview);

module.exports = router;