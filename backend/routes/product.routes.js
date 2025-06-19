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
} = require('../controllers/product.controller');

// Public routes (no auth needed)
router.get('/search', searchProducts);
router.get('/brands', getBrands);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/subcategory/:subcategoryName', getProductsBySubcategory);
router.get('/', getProducts); // Public endpoint - no owner filter

// Public single product route (must be last to avoid conflicts)
router.get('/:id', getProductById); // Public product view

// Get product images
router.get('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select('product_images product_image product_name');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const images = product.product_images && product.product_images.length > 0
      ? product.product_images
      : product.product_image
        ? [{ url: product.product_image, alt_text: product.product_name }]
        : [];

    res.json({
      success: true,
      images,
      count: images.length
    });

  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product images'
    });
  }
});

module.exports = router;