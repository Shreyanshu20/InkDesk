// Add these routes if they don't exist

const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');

// Import product controller functions
const {
  getAdminProducts,
  getAdminProductById,
  getAdminStats,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts
} = require('../controllers/product.controller');

// Apply auth middleware to all admin routes
router.use(userAuth);

// Product management routes - FIXED
router.get('/products', getAdminProducts);
router.get('/products/stats', getAdminStats);
router.get('/products/:id', getAdminProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/bulk-delete', bulkDeleteProducts);

// Categories management
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

// Orders management (orders for products owned by this seller)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy, sortOrder } = req.query;
    const sellerId = req.userId;
    
    // Find orders that contain products owned by this seller
    let matchQuery = {
      'items.product_id': {
        $in: await Product.find({ owner: sellerId }).distinct('_id')
      }
    };
    
    if (status && status !== 'all') {
      matchQuery.status = status;
    }
    
    if (search) {
      matchQuery.$or = [
        { order_number: { $regex: search, $options: 'i' } },
        { 'shipping_address.name': { $regex: search, $options: 'i' } },
        { 'shipping_address.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    let sort = { createdAt: -1 };
    if (sortBy && sortOrder) {
      const sortDirection = sortOrder === 'ascending' ? 1 : -1;
      sort = { [sortBy]: sortDirection };
    }
    
    const orders = await Order.find(matchQuery)
      .populate('user_id', 'first_name last_name email')
      .populate('items.product_id', 'product_name product_price owner')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Filter orders to only include items for this seller's products
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => 
        item.product_id && item.product_id.owner.toString() === sellerId
      );
      
      if (sellerItems.length > 0) {
        return {
          ...order.toObject(),
          items: sellerItems,
          // Recalculate total for seller's items only
          seller_total: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      }
      return null;
    }).filter(Boolean);
    
    const total = await Order.countDocuments(matchQuery);
    
    res.json({
      success: true,
      orders: filteredOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: parseInt(page) < Math.ceil(total / limit),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Reviews for seller's products
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

// Dashboard analytics for seller
router.get('/dashboard/analytics', async (req, res) => {
  try {
    const sellerId = req.userId;
    
    // Get seller's products
    const sellerProducts = await Product.find({ owner: sellerId });
    const sellerProductIds = sellerProducts.map(p => p._id);
    
    // Basic stats
    const totalProducts = sellerProducts.length;
    const activeProducts = sellerProducts.filter(p => p.product_stock > 0).length;
    const outOfStockProducts = totalProducts - activeProducts;
    
    // Orders containing seller's products
    const orders = await Order.find({
      'items.product_id': { $in: sellerProductIds }
    }).populate('items.product_id', 'owner');
    
    // Calculate seller-specific metrics
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalItemsSold = 0;
    
    orders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        item.product_id && sellerProductIds.some(id => id.equals(item.product_id._id))
      );
      
      if (sellerItems.length > 0) {
        totalOrders++;
        sellerItems.forEach(item => {
          totalRevenue += item.price * item.quantity;
          totalItemsSold += item.quantity;
        });
      }
    });
    
    // Recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOrders = await Order.find({
      'items.product_id': { $in: sellerProductIds },
      createdAt: { $gte: thirtyDaysAgo }
    }).populate('items.product_id', 'owner');
    
    const recentRevenue = recentOrders.reduce((sum, order) => {
      const sellerItems = order.items.filter(item => 
        item.product_id && sellerProductIds.some(id => id.equals(item.product_id._id))
      );
      return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);
    
    // Top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product_id && sellerProductIds.some(id => id.equals(item.product_id._id))) {
          const productId = item.product_id._id.toString();
          if (!productSales[productId]) {
            productSales[productId] = { quantity: 0, revenue: 0 };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        }
      });
    });
    
    const topProducts = await Promise.all(
      Object.entries(productSales)
        .sort(([,a], [,b]) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(async ([productId, sales]) => {
          const product = await Product.findById(productId);
          return {
            id: productId,
            name: product.product_name,
            quantitySold: sales.quantity,
            revenue: sales.revenue
          };
        })
    );
    
    res.json({
      success: true,
      analytics: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalRevenue,
        totalOrders,
        totalItemsSold,
        recentRevenue,
        topProducts,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;