const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const cartController = require('../controllers/cart.controller');

router.use(userAuth);

// ========== CART MANAGEMENT ROUTES ==========//
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCartItems);
router.get('/count', cartController.getCartCount);
router.put('/:cartItemId', cartController.updateCartItem);
router.delete('/:cartItemId', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;