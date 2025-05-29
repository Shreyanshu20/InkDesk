const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const { userAuth } = require('../middleware/userAuth');


// Import controller functions
const {
  getProducts,
  getProductById,
  getBrands,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,
  deleteProduct
} = require('../controllers/product.controller');

// Public routes (no auth needed)
router.get('/search', searchProducts);
router.get('/brands', getBrands);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/subcategory/:subcategoryName', getProductsBySubcategory);
router.get('/', getProducts); // Public endpoint - no owner filter

// Admin routes (require authentication)
router.get('/admin', userAuth, getProducts); // Admin endpoint - filters by owner
router.delete('/:id', userAuth, deleteProduct); // Delete requires auth

// Create product
router.post('/', async (req, res) => {
  try {
    console.log('📦 Creating product with data:', req.body);
    
    const {
      product_name,
      product_brand,
      product_description,
      product_price,
      product_discount = 0,
      product_images = [],
      product_stock = 0,
      product_category,
      product_subcategory
    } = req.body;

    // Find the category by name to get the ObjectId
    const Category = require('../models/category.model');
    const category = await Category.findOne({ category_name: product_category });
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category provided'
      });
    }

    // Create product data with required fields
    const productData = {
      product_name,
      product_brand,
      product_description,
      product_price,
      product_discount,
      product_images,
      product_stock,
      product_category, // Keep the string for compatibility
      product_subcategory,
      category: category._id, // Required ObjectId reference
      owner: req.user?.id || req.body.owner || '507f1f77bcf86cd799439011' // Default owner or from auth
    };

    console.log('💾 Product data to save:', productData);

    const product = new Product(productData);
    await product.save();

    console.log('✅ Product created successfully:', product._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product (PUT /products/:id)
router.put('/:id', async (req, res) => {
  try {
    console.log('📦 Updating product:', req.params.id, req.body);
    
    const {
      product_name,
      product_brand,
      product_description,
      product_price,
      product_discount = 0,
      product_images = [],
      product_stock = 0,
      product_category,
      product_subcategory
    } = req.body;

    // Find the category by name to get the ObjectId if category is provided
    let categoryId;
    if (product_category) {
      const Category = require('../models/category.model');
      const category = await Category.findOne({ category_name: product_category });
      
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category provided'
        });
      }
      categoryId = category._id;
    }

    const updateData = {
      product_name,
      product_brand,
      product_description,
      product_price,
      product_discount,
      product_images,
      product_stock,
      product_category,
      product_subcategory
    };

    // Add category ObjectId if provided
    if (categoryId) {
      updateData.category = categoryId;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('✅ Product updated successfully');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Get product by ID (GET /products/:id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

module.exports = router;