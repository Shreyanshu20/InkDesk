const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/User.model');
const Category = require('../models/category.model');
const Review = require('../models/review.model');

const {
  getAdminProducts,
  getAdminStats,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts
} = require('../controllers/product.controller');

const {
  getAdminOrders,
  getAdminOrderStats,
  getAdminOrderById,
  updateAdminOrderStatus,
  deleteAdminOrder
} = require('../controllers/orders.controller');

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
    const {
      page = 1,
      limit = 10,
      search = '',
      rating = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('🔍 Admin reviews request:', {
      page,
      limit,
      search,
      rating,
      sortBy,
      sortOrder
    });

    // Build query for ALL reviews (not filtered by seller)
    let query = {};

    // Add rating filter
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    // Add search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      // Find users matching search terms
      const matchingUsers = await User.find({
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');

      // Find products matching search terms
      const matchingProducts = await Product.find({
        product_name: searchRegex
      }).select('_id');

      const matchingUserIds = matchingUsers.map(u => u._id);
      const matchingProductIds = matchingProducts.map(p => p._id);

      query.$or = [
        { comment: searchRegex },
        { user_id: { $in: matchingUserIds } },
        { product_id: { $in: matchingProductIds } }
      ];
    }

    // Build sort object
    let sortObject = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('📊 Query:', JSON.stringify(query, null, 2));
    console.log('🔄 Sort:', sortObject);

    // Get ALL reviews with pagination
    const reviews = await Review.find(query)
      .populate('user_id', 'first_name last_name email avatar')
      .populate('product_id', 'product_name product_image category')
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const totalReviews = await Review.countDocuments(query);

    console.log(`📝 Found ${reviews.length} reviews of ${totalReviews} total`);

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalReviews / parseInt(limit)),
      totalReviews,
      hasNextPage: parseInt(page) < Math.ceil(totalReviews / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    };

    res.json({
      success: true,
      reviews: reviews,
      pagination
    });

  } catch (error) {
    console.error('❌ Error fetching admin reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Delete review (admin can delete any review)
router.delete('/reviews/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;

    console.log('🗑️ Admin deleting review:', reviewId);

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.product_id;

    await Review.findByIdAndDelete(reviewId);

    // Update product rating after deletion
    try {
      const reviews = await Review.find({ product_id: productId });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

        await Product.findByIdAndUpdate(productId, {
          product_rating: avgRating,
          review_count: reviews.length
        });
      } else {
        await Product.findByIdAndUpdate(productId, {
          product_rating: 0,
          review_count: 0
        });
      }
    } catch (updateError) {
      console.log('⚠️ Error updating product rating:', updateError.message);
    }

    console.log(`✅ Deleted review ${reviewId}`);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// ========== USER STATISTICS ROUTE ==========
router.get('/users/stats', async (req, res) => {
  try {
    console.log('📊 Getting user statistics for admin');

    // Get all users (not paginated)
    const allUsers = await User.find({});

    // Calculate stats
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.status === 'active').length,
      inactive: allUsers.filter(u => u.status === 'inactive').length,
      suspended: allUsers.filter(u => u.status === 'suspended').length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      users: allUsers.filter(u => u.role === 'user').length,
      // Additional useful stats
      verifiedUsers: allUsers.filter(u => u.isAccountVerified === true).length,
      recentUsers: allUsers.filter(u => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(u.createdAt) > oneWeekAgo;
      }).length
    };

    console.log('📈 User stats:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// ========== ORDER STATISTICS ROUTE ==========
router.get('/orders/stats', async (req, res) => {
  try {
    console.log('📊 Getting order statistics for admin');

    // Get all orders (not paginated)
    const allOrders = await Order.find({});

    // Calculate basic stats
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'pending').length,
      processing: allOrders.filter(o => o.status === 'processing').length,
      shipped: allOrders.filter(o => o.status === 'shipped').length,
      delivered: allOrders.filter(o => o.status === 'delivered').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      // Additional useful stats
      totalRevenue: allOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0),
      averageOrderValue: 0,
      todaysOrders: allOrders.filter(o => {
        const today = new Date();
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === today.toDateString();
      }).length,
      thisWeekOrders: allOrders.filter(o => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(o.createdAt) > oneWeekAgo;
      }).length
    };

    // Calculate average order value
    const completedOrders = allOrders.filter(o =>
      o.status !== 'cancelled' && o.total_amount > 0
    );
    if (completedOrders.length > 0) {
      stats.averageOrderValue = stats.totalRevenue / completedOrders.length;
    }

    console.log('📈 Order stats:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

// ========== REVIEW STATISTICS ROUTE ==========
router.get('/reviews/stats', async (req, res) => {
  try {
    console.log('📊 Getting review stats for admin');

    // Get ALL reviews (not filtered by seller)
    const allReviews = await Review.find({});

    // Calculate stats
    const stats = {
      totalReviews: allReviews.length,
      averageRating: 0,
      ratingBreakdown: {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length,
      }
    };

    // Calculate average rating
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      stats.averageRating = Number((totalRating / allReviews.length).toFixed(1));
    }

    console.log('📈 Review stats:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics'
    });
  }
});

// ========== EXISTING ROUTES (KEEP THESE AFTER STATS ROUTES) ==========

// Get all users with pagination and filters (existing route)
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('🔍 Admin users request:', {
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder
    });

    // Build query
    let query = {};

    // Add status filter (using your existing enum: active, inactive, suspended)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { first_name: searchRegex },
        { last_name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    // Build sort object
    let sortObject = {};
    if (sortBy === 'name') {
      sortObject.first_name = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('📊 Query:', JSON.stringify(query, null, 2));
    console.log('🔄 Sort:', sortObject);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -verify_Otp -forget_password_otp') // Exclude sensitive fields
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const totalUsers = await User.countDocuments(query);

    console.log(`👥 Found ${users.length} users of ${totalUsers} total`);

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      total: totalUsers,
      hasNextPage: parseInt(page) < Math.ceil(totalUsers / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    };

    res.json({
      success: true,
      users: users,
      pagination
    });

  } catch (error) {
    console.error('❌ Error fetching admin users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get user by ID (existing route - AFTER stats route)
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('👤 Getting user:', userId);

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Found user:', user.email);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});


module.exports = router;