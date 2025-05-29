// Make sure this is at the very top before any other imports
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
console.log('Adding middleware...');
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'InkDesk API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Upload routes (need to be registered early)
try {
  app.use('/api/upload', require('./routes/upload.routes'));
  console.log('✅ Upload routes registered at /api/upload');
} catch (error) {
  console.error('❌ Upload routes error:', error.message);
}

// Test route for upload endpoint
app.get('/api/upload/test', (req, res) => {
  res.json({ message: 'Upload route is working!' });
});

// Auth routes
try {
  const authRoutes = require('./routes/auth.routes.js');
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes loaded at /auth');
} catch (error) {
  console.error('❌ Auth routes error:', error.message);
}

// User routes
try {
  const userRoutes = require('./routes/user.routes');
  app.use('/user', userRoutes);
  console.log('✅ User routes loaded at /user');
} catch (error) {
  console.error('❌ User routes error:', error.message);
}

// Product routes
try {
  const productRoutes = require('./routes/product.routes');
  app.use('/products', productRoutes);
  console.log('✅ Product routes loaded at /products');
} catch (error) {
  console.error('❌ Product routes error:', error.message);
}

// Category routes
try {
  const categoryRoutes = require('./routes/category.routes');
  app.use('/categories', categoryRoutes);
  console.log('✅ Category routes loaded at /categories');
} catch (error) {
  console.error('❌ Category routes error:', error.message);
}

// Subcategory routes
try {
  const subcategoryRoutes = require('./routes/subcategory.routes');
  app.use('/subcategories', subcategoryRoutes);
  console.log('✅ Subcategory routes loaded at /subcategories');
} catch (error) {
  console.error('❌ Subcategory routes error:', error.message);
}

// Cart routes
try {
  const cartRoutes = require('./routes/cart.routes');
  app.use('/cart', cartRoutes);
  console.log('✅ Cart routes loaded at /cart');
} catch (error) {
  console.error('❌ Cart routes error:', error.message);
}

// Wishlist routes
try {
  const wishlistRoutes = require('./routes/wishlist.route');
  app.use('/wishlist', wishlistRoutes);
  console.log('✅ Wishlist routes loaded at /wishlist');
} catch (error) {
  console.error('❌ Wishlist routes error:', error.message);
}

// Order routes
try {
  const orderRoutes = require('./routes/orders.routes');
  app.use('/orders', orderRoutes);
  console.log('✅ Order routes loaded at /orders');
} catch (error) {
  console.error('❌ Order routes error:', error.message);
}

// Review routes
try {
  const reviewRoutes = require('./routes/review.routes.js');
  app.use('/reviews', reviewRoutes);
  console.log('✅ Review routes loaded at /reviews');
} catch (error) {
  console.error('❌ Review routes error:', error.message);
}

// Banner routes
try {
  const bannerRoutes = require('./routes/banner.routes');
  app.use('/banners', bannerRoutes);
  console.log('✅ Banner routes loaded at /banners');
} catch (error) {
  console.error('❌ Banner routes error:', error.message);
}

// Upload routes
try {
  const uploadRoutes = require('./routes/upload.routes');
  app.use('/upload', uploadRoutes);
  console.log('✅ Upload routes loaded at /upload');
} catch (error) {
  console.error('❌ Upload routes error:', error.message);
}

// Admin routes (should be last among functional routes)
try {
  const adminRoutes = require('./routes/admin.routes');
  app.use('/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.error('❌ Admin routes error:', error.message);
}

// Debug route to check all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ 
    totalRoutes: routes.length,
    routes 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler (must be last)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: [
        'POST /auth/register',
        'POST /auth/login', 
        'POST /auth/logout'
      ],
      products: [
        'GET /products',
        'GET /products/:id',
        'GET /products/brands',
        'GET /products/search?q=keyword',
        'GET /products/category/:categoryName',
        'GET /products/subcategory/:subcategoryName'
      ],
      categories: [
        'GET /categories',
        'GET /categories/with-subcategories'
      ],
      subcategories: [
        'GET /subcategories',
        'GET /subcategories/by-category/:categoryId'
      ],
      admin: [
        'GET /admin/products (Auth Required)',
        'GET /admin/products/stats (Auth Required)',
        'GET /admin/products/:id (Auth Required)',
        'POST /admin/products (Auth Required)',
        'PUT /admin/products/:id (Auth Required)',
        'DELETE /admin/products/:id (Auth Required)'
      ],
      cart: [
        'GET /cart (Auth Required)',
        'POST /cart/add (Auth Required)',
        'PUT /cart/update/:id (Auth Required)',
        'DELETE /cart/remove/:id (Auth Required)'
      ],
      orders: [
        'GET /orders (Auth Required)',
        'POST /orders (Auth Required)',
        'GET /orders/:id (Auth Required)'
      ],
      upload: [
        'POST /api/upload/image (Auth Required)',
        'GET /api/upload/test'
      ],
      debug: [
        'GET /health',
        'GET /debug/routes'
      ]
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Debug routes: http://localhost:${PORT}/debug/routes`);
  console.log(`📁 Upload test: http://localhost:${PORT}/api/upload/test`);
});

module.exports = app;