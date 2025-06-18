const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');
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

// Import category controller functions
const {
  getAdminCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controllers/category.controller');

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
router.get('/categories', getAdminCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// ========== SUBCATEGORY MANAGEMENT ROUTES ==========
router.get('/categories/:categoryId/subcategories', getSubcategoriesByCategory);
router.post('/subcategories', createSubcategory);
router.put('/subcategories/:id', updateSubcategory);
router.delete('/subcategories/:id', deleteSubcategory);

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

    // Build query
    let query = {};

    // Add rating filter
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    // Add search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { comment: searchRegex },
        { 'user_id.first_name': searchRegex },
        { 'user_id.last_name': searchRegex },
        { 'product_id.product_name': searchRegex }
      ];
    }

    // Sort configuration
    let sort = {};
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort
    }

    console.log('📝 Final query:', query);
    console.log('📝 Sort config:', sort);

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reviews with populated data
    const reviews = await Review.find(query)
      .populate('user_id', 'first_name last_name email')
      .populate('product_id', 'product_name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    console.log(`📊 Found ${reviews.length} reviews out of ${total} total`);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Delete review
router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log('🗑️ Deleting review:', reviewId);

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    console.log('✅ Review deleted successfully');
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
      verified: allUsers.filter(u => u.isAccountVerified === true).length,
      unverified: allUsers.filter(u => u.isAccountVerified === false).length,
      withPhone: allUsers.filter(u => u.phone && u.phone.trim() !== '').length,
      withoutPhone: allUsers.filter(u => !u.phone || u.phone.trim() === '').length
    };

    // Calculate registration trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = allUsers.filter(user => 
      user.createdAt && new Date(user.createdAt) >= sevenDaysAgo
    ).length;

    stats.recentRegistrations = recentRegistrations;

    console.log('📊 User stats calculated:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error getting user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// Get review statistics  
router.get('/reviews/stats', async (req, res) => {
  try {
    console.log('📊 Getting review statistics for admin');

    const allReviews = await Review.find({});

    const stats = {
      total: allReviews.length,
      averageRating: allReviews.length > 0 ? 
        (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1) : 0,
      
      // Rating distribution
      fiveStars: allReviews.filter(r => r.rating === 5).length,
      fourStars: allReviews.filter(r => r.rating === 4).length,
      threeStars: allReviews.filter(r => r.rating === 3).length,
      twoStars: allReviews.filter(r => r.rating === 2).length,
      oneStar: allReviews.filter(r => r.rating === 1).length,
    };

    // Recent reviews (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentReviews = allReviews.filter(review => 
      review.createdAt && new Date(review.createdAt) >= sevenDaysAgo
    ).length;

    stats.recentReviews = recentReviews;

    console.log('📊 Review stats calculated:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error getting review statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics'
    });
  }
});

// ========== EXISTING ROUTES (KEEP THESE AFTER STATS ROUTE) ==========

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
        { email: searchRegex }
      ];
    }

    // Sort configuration
    let sort = {};
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by creation date, newest first
    }

    console.log('📝 Final query:', query);
    console.log('📝 Sort config:', sort);

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.find(query)
      .select('-password -verify_Otp -forget_password_otp -verify_Otp_expiry -forget_password_otp_expiry') // Exclude sensitive fields
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    console.log(`📊 Found ${users.length} users out of ${total} total`);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

module.exports = router;