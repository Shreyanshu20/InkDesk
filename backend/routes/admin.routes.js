// Add these routes if they don't exist

const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const User = require('../models/User.model');
const Product = require('../models/product.model');

const Review = require('../models/review.model');

// Get all users (admin)
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, role, sortBy, sortOrder } = req.query;
        
        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Role filter
        if (role && role !== 'all') {
            query.role = role;
        }

        // Build sort object
        let sort = { createdAt: -1 }; // Default sort
        if (sortBy && sortOrder) {
            const sortDirection = sortOrder === 'ascending' ? 1 : -1;
            
            // Map frontend sort keys to backend fields
            const sortMapping = {
                'name': 'first_name',
                'email': 'email',
                'role': 'role',
                'status': 'status',
                'createdAt': 'createdAt'
            };
            
            const backendSortKey = sortMapping[sortBy] || 'createdAt';
            sort = { [backendSortKey]: sortDirection };
        }
        
        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sort);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get user by ID (admin)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    const orders = await Order.find({ user_id: req.params.id })
      .populate('items.product_id', 'product_name product_price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        orders
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// Update user status (admin)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Delete user (admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Update user (admin)
router.put('/users/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, role, status } = req.body;
    
    const updateData = {
      first_name,
      last_name,
      email,
      phone,
      role,
      status
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Get all orders (admin)
router.get('/orders', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        let query = {};

        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search filter (by order number)
        if (search) {
            query.order_number = { $regex: search, $options: 'i' };
        }

        const orders = await Order.find(query)
            .populate('user_id', 'first_name last_name email')
            .populate('items.product_id', 'product_name product_price product_image')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Get single order by ID (admin)
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user_id', 'first_name last_name email')
            .populate('items.product_id', 'product_name product_price product_image product_brand');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
});

// Update order status (admin)
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user_id', 'first_name last_name email')
            .populate('items.product_id', 'product_name product_price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
});

// Delete order (admin)
router.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
});

// Get all reviews (admin)
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, search, sortBy, sortOrder } = req.query;
    
    let query = {};
    
    // Rating filter
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }
    
    // Search filter
    if (search) {
      query.comment = { $regex: search, $options: 'i' };
    }
    
    // Build sort object
    let sort = { createdAt: -1 }; // Default sort
    if (sortBy && sortOrder) {
      const sortDirection = sortOrder === 'ascending' ? 1 : -1;
      
      // Map frontend sort keys to backend fields
      const sortMapping = {
        'rating': 'rating',
        'date': 'createdAt'
      };
      
      const backendSortKey = sortMapping[sortBy] || 'createdAt';
      sort = { [backendSortKey]: sortDirection };
    }
    
    const reviews = await Review.find(query)
      .populate('user_id', 'first_name last_name email avatar')
      .populate('product_id', 'product_name product_price product_image category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);
    
    const total = await Review.countDocuments(query);
    
    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get review by ID (admin)
router.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user_id', 'first_name last_name email avatar')
      .populate('product_id', 'product_name product_price product_image category');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
});

// Delete review (admin)
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

module.exports = router;