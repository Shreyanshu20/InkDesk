const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const orderController = require('../controllers/orders.controller');

// All routes require authentication
router.use(userAuth);

// Create new order
router.post('/create', orderController.createOrder);

// Get user's orders
router.get('/my-orders', orderController.getUserOrders);

// Buy now order
router.post('/buy-now', orderController.buyNowOrder);

// Cancel order
router.put('/:orderId/cancel', orderController.cancelOrder);

// Get single order details
router.get('/:orderId', orderController.getOrderDetails);

module.exports = router;