const express = require('express');
const router = express.Router();
const { userAuth, adminOnly, adminPanelAuth } = require('../middleware/userAuth');

const adminController = require('../controllers/admin.controller');

router.use(userAuth);
router.use(adminPanelAuth);



// ========== PRODUCT MANAGEMENT ROUTES ==========//
// READ operations - accessible by both admin and user
router.get('/products', adminController.getAdminProducts);
router.get('/products/stats', adminController.getAdminStats);
router.get('/products/:id', adminController.getAdminProductById);

// WRITE operations - admin only
router.post('/products', adminOnly, adminController.createProduct);
router.put('/products/:id', adminOnly, adminController.updateProduct);
router.delete('/products/:id', adminOnly, adminController.deleteProduct);
router.post('/products/bulk-delete', adminOnly, adminController.bulkDeleteProducts);



// ========== CATEGORY MANAGEMENT ROUTES ==========//
// READ operations - accessible by both admin and user
router.get('/categories', adminController.getAdminCategories);
router.get('/categories/:id', adminController.getAdminCategoryById);
router.get('/categories/:id/subcategories', adminController.getAdminSubCategories);

// WRITE operations - admin only
router.post('/categories', adminOnly, adminController.createAdminCategory);
router.put('/categories/:id', adminOnly, adminController.updateAdminCategory);
router.delete('/categories/:id', adminOnly, adminController.deleteAdminCategory);



// ========== SUBCATEGORY MANAGEMENT ROUTES ==========//
// READ operations - accessible by both admin and user
router.get('/subcategories', adminController.getAdminSubcategoriesList);
router.get('/subcategories/:id', adminController.getAdminSubcategoryById);

// WRITE operations - admin only
router.post('/subcategories', adminOnly, adminController.createAdminSubcategory);
router.put('/subcategories/:id', adminOnly, adminController.updateAdminSubcategory);
router.delete('/subcategories/:id', adminOnly, adminController.deleteAdminSubcategory);



// ========== ORDER MANAGEMENT ROUTES ==========//
// READ operations - accessible by both admin and user
router.get('/orders', adminController.getAdminOrders);
router.get('/orders/stats', adminController.getOrderStats);
router.get('/orders/:id', adminController.getAdminOrderById);

// WRITE operations - admin only
router.put('/orders/:id/status', adminOnly, adminController.updateAdminOrderStatus);
router.delete('/orders/:id', adminOnly, adminController.deleteAdminOrder);



// ========== USER MANAGEMENT ROUTES ==========//
// READ operations - accessible by both admin and user
router.get('/users', adminController.getUsers);
router.get('/users/stats', adminController.getUserStats);
router.get('/users/:id', adminController.getUserById);

// WRITE operations - admin only
router.put('/users/:id', adminOnly, adminController.updateUser);
router.put('/users/:id/status', adminOnly, adminController.updateUserStatus);
router.delete('/users/:id', adminOnly, adminController.deleteUser);



// ========== REVIEW MANAGEMENT ROUTES ==========//
// READ operations - accessible by both admin and user
router.get('/reviews', adminController.getAdminReviews);
router.get('/reviews/stats', adminController.getReviewStats);

// WRITE operations - admin only
router.delete('/reviews/:id', adminOnly, adminController.deleteAdminReview);

module.exports = router;