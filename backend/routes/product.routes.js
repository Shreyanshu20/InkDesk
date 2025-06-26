const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// ========== PRODUCT SEARCH ROUTES ==========//
router.get('/search', productController.searchProducts);

// ========== PRODUCT FILTERING ROUTES ==========//
router.get('/brands', productController.getBrands);
router.get('/category/:categoryName', productController.getProductsByCategory);
router.get('/subcategory/:subcategoryName', productController.getProductsBySubcategory);

// ========== PRODUCT RETRIEVAL ROUTES ==========//
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/images', productController.getProductImages);

module.exports = router;