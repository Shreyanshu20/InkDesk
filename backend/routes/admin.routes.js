// Add these routes if they don't exist

const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

// Import existing models (using your actual model names)
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/User.model');
const Category = require('../models/category.model');
const Review = require('../models/review.model');

// Import product controller functions
const {
  getAdminProducts,
  getAdminStats,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts
} = require('../controllers/product.controller');

// Import orders controller functions
const {
  getAdminOrders,
  getAdminOrderStats,
  getAdminOrderById,
  updateAdminOrderStatus,
  deleteAdminOrder
} = require('../controllers/orders.controller');

// Apply auth middleware to all admin routes
router.use(userAuth);

// ========== PRODUCT MANAGEMENT ROUTES ==========
router.get('/products', getAdminProducts);
router.get('/products/stats', getAdminStats);
router.get('/products/:id', getAdminProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/bulk-delete', bulkDeleteProducts);

// ========== CATEGORY MANAGEMENT ROUTES ==========
router.get('/categories', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;

    let query = {};
    if (search) {
      query.category_name = { $regex: search, $options: 'i' };
    }

    let sort = { createdAt: -1 };
    if (sortBy && sortOrder) {
      const sortDirection = sortOrder === 'ascending' ? 1 : -1;
      sort = { [sortBy]: sortDirection };
    }

    const categories = await Category.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Category.countDocuments(query);

    res.json({
      success: true,
      categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCategories: total,
        hasNextPage: parseInt(page) < Math.ceil(total / limit),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = new Category({
      category_name,
      description: description || ''
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({
      _id: { $ne: req.params.id },
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { category_name, description: description || '' },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    // Check if category is being used by any products
    const productsUsingCategory = await Product.countDocuments({
      category: req.params.id
    });

    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is being used by ${productsUsingCategory} product(s).`
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
});

// ========== ORDER MANAGEMENT ROUTES ==========
router.get('/orders', getAdminOrders);
router.get('/orders/stats', getAdminOrderStats);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateAdminOrderStatus);
router.delete('/orders/:id', deleteAdminOrder);

// ========== REVIEWS ROUTES ==========
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, search, sortBy, sortOrder } = req.query;
    const sellerId = req.userId;

    // Find reviews for products owned by this seller
    let query = {
      product_id: {
        $in: await Product.find({ owner: sellerId }).distinct('_id')
      }
    };

    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    if (search) {
      query.comment = { $regex: search, $options: 'i' };
    }

    let sort = { createdAt: -1 };
    if (sortBy && sortOrder) {
      const sortDirection = sortOrder === 'ascending' ? 1 : -1;
      const sortMapping = {
        'rating': 'rating',
        'date': 'createdAt'
      };
      const backendSortKey = sortMapping[sortBy] || 'createdAt';
      sort = { [backendSortKey]: sortDirection };
    }

    const reviews = await Review.find(query)
      .populate('user_id', 'first_name last_name email avatar')
      .populate('product_id', 'product_name product_price product_image category owner')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: parseInt(page) < Math.ceil(total / limit),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

module.exports = router;