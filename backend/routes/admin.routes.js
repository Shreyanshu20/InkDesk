const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

// Import models directly for admin operations
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Review = require('../models/review.model');
const Banner = require('../models/banner.model');

// Apply authentication middleware to all routes
router.use(userAuth);

// Simple auth check middleware
const requireAuth = (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
    next();
};

// Admin role check middleware
const requireAdmin = (req, res, next) => {
    if (!req.userId || req.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// Admin check endpoint
router.get('/is-admin', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.role;
        
        const user = await User.findById(userId).select('-password -verify_Otp -forget_password_otp');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            isAdmin: userRole === 'admin',
            isReadOnly: userRole === 'user',
            role: userRole,
            user: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during admin verification'
        });
    }
});

// Dashboard stats routes
router.get('/dashboard/stats', requireAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const orders = await Order.find({ status: 'delivered' });
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats'
        });
    }
});

router.get('/dashboard/recent-orders', requireAuth, async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user_id', 'first_name last_name email');
        
        res.json({
            success: true,
            orders: recentOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent orders'
        });
    }
});

// ===================
// PRODUCTS ROUTES - SHOW ALL PRODUCTS FOR ADMIN
// ===================

router.get('/products/stats', requireAuth, async (req, res) => {
    try {
        const allProducts = await Product.find({});
        
        const stats = {
            totalProducts: allProducts.length,
            activeProducts: allProducts.filter(p => p.product_stock > 0).length,
            outOfStockProducts: allProducts.filter(p => p.product_stock === 0).length,
            lowStockProducts: allProducts.filter(p => p.product_stock > 0 && p.product_stock <= 10).length,
            totalInventoryValue: allProducts.reduce((total, product) => {
                const price = parseFloat(product.product_price) || 0;
                const stock = parseInt(product.product_stock) || 0;
                return total + (price * stock);
            }, 0)
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product statistics'
        });
    }
});

router.get('/products', requireAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category = '',
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = {};

        // Filter by stock status
        if (status && status !== 'all') {
            if (status === 'active') {
                query.product_stock = { $gt: 0 };
            } else if (status === 'out_of_stock') {
                query.product_stock = { $lte: 0 };
            }
        }

        // Filter by category
        if (category && category !== 'all') {
            query.product_category = new RegExp(category, 'i');
        }

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { product_name: searchRegex },
                { product_description: searchRegex },
                { product_brand: searchRegex },
                { product_category: searchRegex }
            ];
        }

        // Sorting
        let sort = {};
        if (sortBy && sortOrder) {
            let backendSortBy = sortBy;
            if (sortBy === 'name') backendSortBy = 'product_name';
            else if (sortBy === 'price') backendSortBy = 'product_price';
            else if (sortBy === 'inventory') backendSortBy = 'product_stock';
            else if (sortBy === 'category') backendSortBy = 'product_category';
            
            sort[backendSortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get ALL products for admin (no owner filtering)
        const products = await Product.find(query)
            .populate('owner', 'first_name last_name email')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalProducts: total,
                hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// Get single product for admin - FIX THIS ROUTE
router.get('/products/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        console.log('🔍 Fetching product with ID:', id);

        const product = await Product.findById(id)
            .populate('owner', 'first_name last_name email')
            .populate('category_id', 'category_name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.product_name);

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('❌ Error fetching single product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
});

// Update product (Admin only)
router.put('/products/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner', 'first_name last_name email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
});

// Delete product (Admin only)
router.delete('/products/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});

// ===================
// USERS ROUTES - SHOW ALL USERS
// ===================

router.get('/users/stats', requireAuth, async (req, res) => {
    try {
        const allUsers = await User.find({});
        
        const stats = {
            total: allUsers.length,
            active: allUsers.filter(u => u.status === 'active').length,
            inactive: allUsers.filter(u => u.status === 'inactive').length,
            suspended: allUsers.filter(u => u.status === 'suspended').length,
            admins: allUsers.filter(u => u.role === 'admin').length,
            users: allUsers.filter(u => u.role === 'user').length,
            verified: allUsers.filter(u => u.isAccountVerified === true).length,
            unverified: allUsers.filter(u => u.isAccountVerified === false).length
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics'
        });
    }
});

router.get('/users', requireAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { first_name: searchRegex },
                { last_name: searchRegex },
                { email: searchRegex }
            ];
        }

        let sort = {};
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select('-password -verify_Otp -forget_password_otp -verify_Otp_expiry -forget_password_otp_expiry')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await User.countDocuments(query);

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get single user
router.get('/users/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select('-password -verify_Otp -forget_password_otp -verify_Otp_expiry -forget_password_otp_expiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
});

// Update user (Admin only)
router.put('/users/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove sensitive fields from update
        delete updateData.password;
        delete updateData.verify_Otp;
        delete updateData.forget_password_otp;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true })
            .select('-password -verify_Otp -forget_password_otp -verify_Otp_expiry -forget_password_otp_expiry');

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
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

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
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// ===================
// ORDERS ROUTES - SHOW ALL ORDERS
// ===================

router.get('/orders/stats', requireAuth, async (req, res) => {
    try {
        const allOrders = await Order.find({});
        
        const stats = {
            total: allOrders.length,
            pending: allOrders.filter(o => o.status === 'pending').length,
            processing: allOrders.filter(o => o.status === 'processing').length,
            shipped: allOrders.filter(o => o.status === 'shipped').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length,
            totalRevenue: allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order statistics'
        });
    }
});

router.get('/orders', requireAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        let sort = {};
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .populate('user_id', 'first_name last_name email')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalOrders: total,
                hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Get single order
router.get('/orders/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('user_id', 'first_name last_name email phone')
            .populate('items.product_id', 'product_name product_price product_image owner');

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
});

// Update order status (Admin only)
router.put('/orders/:id/status', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required'
            });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
            .populate('user_id', 'first_name last_name email');

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
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
});

// Delete order (Admin only)
router.delete('/orders/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByIdAndDelete(id);

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
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
});

// ===================
// REVIEWS ROUTES - SHOW ALL REVIEWS
// ===================

router.get('/reviews/stats', requireAuth, async (req, res) => {
    try {
        const allReviews = await Review.find({});
        
        const stats = {
            total: allReviews.length,
            rating5: allReviews.filter(r => r.rating === 5).length,
            rating4: allReviews.filter(r => r.rating === 4).length,
            rating3: allReviews.filter(r => r.rating === 3).length,
            rating2: allReviews.filter(r => r.rating === 2).length,
            rating1: allReviews.filter(r => r.rating === 1).length,
            averageRating: allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review statistics'
        });
    }
});

router.get('/reviews', requireAuth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            rating = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = {};

        if (rating && rating !== 'all') {
            query.rating = parseInt(rating);
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { comment: searchRegex }
            ];
        }

        let sort = {};
        if (sortBy && sortOrder) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const reviews = await Review.find(query)
            .populate('user_id', 'first_name last_name email')
            .populate('product_id', 'product_name')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Review.countDocuments(query);

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews'
        });
    }
});

// Delete review (Admin only)
router.delete('/reviews/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByIdAndDelete(id);

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
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
});

// Categories and Banners routes (unchanged)
router.get('/categories', requireAuth, async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
});

router.get('/banners', requireAuth, async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            banners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch banners'
        });
    }
});

module.exports = router;