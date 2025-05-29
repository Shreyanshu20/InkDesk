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

// ========== USER MANAGEMENT ROUTES ==========

// Get all users with pagination and filtering
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

// Get single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log('🔍 Getting user details:', userId);
    
    const user = await User.findById(userId)
      .select('-password -verify_Otp -forget_password_otp') // Exclude sensitive fields
      .populate('address_details')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    let userOrders = [];
    try {
      userOrders = await Order.find({ user_id: userId })
        .select('order_number total_amount status createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    } catch (orderError) {
      console.log('⚠️ Could not fetch user orders:', orderError.message);
    }

    // Add orders to user object
    user.orders = userOrders;
    
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

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, email, phone, role, status } = req.body;
    
    console.log('📝 Updating user:', userId, req.body);
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user fields (only fields that exist in your model)
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    
    // Validate role (only 'admin' or 'user' allowed)
    if (role !== undefined && ['admin', 'user'].includes(role)) {
      user.role = role;
    }
    
    // Validate status (only 'active', 'inactive', 'suspended' allowed)
    if (status !== undefined && ['active', 'inactive', 'suspended'].includes(status)) {
      user.status = status;
    }
    
    await user.save();
    
    console.log(`✅ Updated user ${userId}`);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    // Validate status using your existing enum
    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active, inactive, or suspended)'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.status = status;
    await user.save();
    
    console.log(`✅ Updated user ${userId} status to ${status}`);
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      user: {
        _id: user._id,
        status: user.status
      }
    });
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Clean up user's related data
    try {
      // Delete user's orders
      await Order.deleteMany({ user_id: userId });
      
      // Delete user's addresses if address_details has addresses
      if (user.address_details && user.address_details.length > 0) {
        // Try to delete addresses, but don't fail if Address model doesn't exist
        try {
          const Address = require('../models/Address.model');
          await Address.deleteMany({ _id: { $in: user.address_details } });
        } catch (addressError) {
          console.log('⚠️ Could not delete addresses:', addressError.message);
        }
      }
    } catch (cleanupError) {
      console.log('⚠️ Error cleaning up user data:', cleanupError.message);
    }
    
    console.log(`🗑️ Deleted user ${userId}`);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Get user statistics
router.get('/users/stats', async (req, res) => {
  try {
    console.log('📊 Getting user stats');

    // Use your existing status enum values
    const stats = {
      total: await User.countDocuments({}),
      active: await User.countDocuments({ status: 'active' }),
      inactive: await User.countDocuments({ status: 'inactive' }),
      suspended: await User.countDocuments({ status: 'suspended' }),
      admins: await User.countDocuments({ role: 'admin' }),
      users: await User.countDocuments({ role: 'user' })
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
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

module.exports = router;