const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../controllers/cart.controller');

// All cart routes require authentication
router.use(userAuth);

// Add item to cart
router.post('/add', addToCart);

// Get cart items
router.get('/', getCartItems);

// Get cart count (for navbar badge)
router.get('/count', getCartCount);

// Update cart item quantity
router.put('/:cartItemId', updateCartItem);

// Remove item from cart
router.delete('/:cartItemId', removeFromCart);

// Clear entire cart
router.post('/clear', clearCart); // Use the controller function

// Debug route to get raw shopping cart data for the logged-in user
router.get('/debug-raw', async (req, res) => {
  try {
    const userId = req.userId;
    const User = require('../models/User.model');
    
    const user = await User.findById(userId);
    
    res.json({
      success: true,
      debug: {
        userId,
        userExists: !!user,
        shoppingCartLength: user?.shopping_cart?.length || 0,
        shoppingCartRaw: user?.shopping_cart || [],
        firstItemDetails: user?.shopping_cart?.[0] || null
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;