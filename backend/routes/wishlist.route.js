const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require('../controllers/wishlist.controller');

// All routes require authentication
router.use(userAuth);

// Get user's wishlist
router.get('/', getWishlist);

// Add to wishlist
router.post('/add', addToWishlist);

// Remove from wishlist - Use DELETE method with params
router.delete('/remove/:product_id', removeFromWishlist);

module.exports = router;