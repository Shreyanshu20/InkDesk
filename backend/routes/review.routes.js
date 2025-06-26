const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const reviewController = require('../controllers/review.controller');

// ========== PUBLIC REVIEW ROUTES ==========//
router.get('/product/:productId', reviewController.getProductReviews);

// ========== PROTECTED REVIEW ROUTES ==========//
router.use(userAuth);
router.post('/create', reviewController.createReview);
router.get('/my-reviews', reviewController.getUserReviews);
router.get('/can-review/:productId', reviewController.canUserReview);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;