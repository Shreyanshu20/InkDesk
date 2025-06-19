const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

const adminController = require('../controllers/admin.controller');

router.use(userAuth);

// ========== PRODUCT MANAGEMENT ROUTES ==========
router.get('/products', adminController.getAdminProducts);
router.get('/products/stats', adminController.getAdminStats);
router.get('/products/:id', adminController.getAdminProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.post('/products/bulk-delete', adminController.bulkDeleteProducts);

// ========== CATEGORY MANAGEMENT ROUTES ==========
router.get('/categories', adminController.getAdminCategories);
router.get('/categories/:id', adminController.getAdminCategoryById);
router.get('/categories/:id/subcategories', adminController.getAdminSubCategories);
router.post('/categories', adminController.createAdminCategory);
router.put('/categories/:id', adminController.updateAdminCategory);
router.delete('/categories/:id', adminController.deleteAdminCategory);

// ========== SUBCATEGORY MANAGEMENT ROUTES ==========
router.get('/subcategories', adminController.getAdminSubcategoriesList);
router.get('/subcategories/:id', adminController.getAdminSubcategoryById);
router.post('/subcategories', adminController.createAdminSubcategory);
router.put('/subcategories/:id', adminController.updateAdminSubcategory);
router.delete('/subcategories/:id', adminController.deleteAdminSubcategory);

// ========== ORDER MANAGEMENT ROUTES ==========//
router.get('/orders', adminController.getAdminOrders);
router.get('/orders/stats', adminController.getOrderStats);
router.get('/orders/:id', adminController.getAdminOrderById);
router.put('/orders/:id/status', adminController.updateAdminOrderStatus);
router.delete('/orders/:id', adminController.deleteAdminOrder);

// ========== USER MANAGEMENT ROUTES ==========
router.get('/users', adminController.getAdminUsers);
router.get('/users/stats', adminController.getUserStats);
router.get('/users/:id', adminController.getAdminUserById);

// ========== REVIEW MANAGEMENT ROUTES ==========
router.get('/reviews', adminController.getAdminReviews);
router.get('/reviews/stats', adminController.getReviewStats);
router.delete('/reviews/:id', adminController.deleteAdminReview);

module.exports = router;