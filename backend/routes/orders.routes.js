const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const orderController = require('../controllers/orders.controller');

router.use(userAuth);

// ========== ORDER MANAGEMENT ROUTES ==========//
router.post('/create', orderController.createOrder);
router.post('/buy-now', orderController.buyNowOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.put('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;