const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

// Import controller functions
const {
  // Public functions
  getProducts,
  getProductById,
  getBrands,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,
  
  // Admin functions (these are handled by admin routes, not here)
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts
} = require('../controllers/product.controller');

// Public routes (no auth needed)
router.get('/search', searchProducts);
router.get('/brands', getBrands);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/subcategory/:subcategoryName', getProductsBySubcategory);
router.get('/', getProducts); // Public endpoint - no owner filter

// Admin product operations (require authentication) - these create/update/delete products
router.post('/', userAuth, createProduct); // Create product
router.put('/:id', userAuth, updateProduct); // Update product
router.delete('/:id', userAuth, deleteProduct); // Delete single product
router.post('/bulk-delete', userAuth, bulkDeleteProducts); // Bulk delete

// Public single product route (must be last to avoid conflicts)
router.get('/:id', getProductById); // Public product view

module.exports = router;