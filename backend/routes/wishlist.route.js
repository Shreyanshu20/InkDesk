const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const wishlistController = require('../controllers/wishlist.controller');

router.use(userAuth);

// Get user's wishlist
router.get('/', wishlistController.getWishlist);

// Add to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove from wishlist
router.delete('/remove/:product_id', wishlistController.removeFromWishlist);

module.exports = router;