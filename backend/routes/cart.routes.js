const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const cartController = require('../controllers/cart.controller');

// All cart routes require authentication
router.use(userAuth);

// Add item to cart
router.post('/add', cartController.addToCart);

// Get cart items
router.get('/', cartController.getCartItems);

// Get cart count (for navbar badge)
router.get('/count', cartController.getCartCount);

// Update cart item quantity
router.put('/:cartItemId', cartController.updateCartItem);

// Remove item from cart
router.delete('/:cartItemId', cartController.removeFromCart);

// Clear entire cart
router.post('/clear', cartController.clearCart);

module.exports = router;