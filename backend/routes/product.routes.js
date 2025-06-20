const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

// search products
router.get('/search', productController.searchProducts);

// Get products by brand
router.get('/brands', productController.getBrands);

// Get products by category
router.get('/category/:categoryName', productController.getProductsByCategory);

// Get products by subcategory
router.get('/subcategory/:subcategoryName', productController.getProductsBySubcategory);

// Get all products
router.get('/', productController.getProducts);

// Get product by details
router.get('/:id', productController.getProductById);

// Get product images
router.get('/:id/images', productController.getProductImages);

module.exports = router;