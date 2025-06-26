const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const wishlistController = require('../controllers/wishlist.controller');

router.use(userAuth);

// ========== WISHLIST MANAGEMENT ROUTES ==========//
router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addToWishlist);
router.delete('/remove/:product_id', wishlistController.removeFromWishlist);

module.exports = router;