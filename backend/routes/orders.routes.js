const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const {
  getUserOrders,
  getOrderDetails,
  createOrder,
  cancelOrder,
  buyNowOrder
} = require('../controllers/orders.controller');

// All routes require authentication
router.use(userAuth);

// Create new order
router.post('/create', createOrder);

// Get user's orders
router.get('/my-orders', getUserOrders);

// Buy now order
router.post('/buy-now', buyNowOrder);

// Cancel order
router.put('/:orderId/cancel', cancelOrder);

// Get single order details
router.get('/:orderId', getOrderDetails);

module.exports = router;