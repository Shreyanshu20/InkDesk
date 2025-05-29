// Make sure this is at the very top before any other imports
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');
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

// Auth routes
app.use('/auth', authRoutes);

// Product routes
try {
  const productRoutes = require('./routes/product.routes');
  app.use('/products', productRoutes);
  console.log('✅ Product routes loaded');
} catch (error) {
  console.error('❌ Product routes error:', error.message);
}

// Category routes
app.use('/categories', require('./routes/category.routes'));
console.log('✅ Category routes registered at /categories');

// Cart routes - ADD THIS
try {
  const cartRoutes = require('./routes/cart.routes');
  app.use('/cart', cartRoutes);
  console.log('✅ Cart routes loaded');
} catch (error) {
  console.error('❌ Cart routes error:', error.message);
}

// User routes - ADD THIS
try {
  const userRoutes = require('./routes/user.routes');
  app.use('/user', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ User routes error:', error.message);
}

// Wishlist routes - ADD THIS
try {
  const wishlistRoutes = require('./routes/wishlist.route');
  app.use('/wishlist', wishlistRoutes);
  console.log('✅ Wishlist routes loaded');
} catch (error) {
  console.error('❌ Wishlist routes error:', error.message);
}

// Add this with your other routes
try {
  const orderRoutes = require('./routes/orders.routes');
  app.use('/orders', orderRoutes);
  console.log('✅ Order routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load order routes:', error.message);
}

try {
  const reviewRoutes = require('./routes/review.routes.js');
  app.use('/reviews', reviewRoutes);
  console.log('✅ review routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load review routes:', error.message);
}

// Add admin routes
try {
  const adminRoutes = require('./routes/admin.routes');
  app.use('/admin', adminRoutes);
  console.log('✅ Admin routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load admin routes:', error.message);
}

// Add this BEFORE other routes
app.use('/api/upload', require('./routes/upload.routes'));
console.log('🚀 Upload routes registered at /api/upload');

// Test route to check if upload endpoint exists
app.get('/api/upload/test', (req, res) => {
  res.json({ message: 'Upload route is working!' });
});

// Add this AFTER your routes are loaded but BEFORE the 404 handler
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
  res.json({ routes });
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'POST /auth/register',
      'POST /auth/login',
      'POST /auth/logout',
      'GET /products',
      'GET /products?featured=true',
      'GET /products?discount=true',
      'GET /products?sort=newest-desc',
      'GET /products/brands',
      'GET /products/search?q=keyword',
      'GET /products/category/:categoryName',
      'GET /products/subcategory/:subcategoryName',
      'GET /products/:id',
      'GET /products/:id/related',
      'GET /categories',
      'GET /categories/with-subcategories',
      'POST /cart/add (Auth Required)',
      'GET /cart (Auth Required)',
      'GET /cart/count (Auth Required)',
      'PUT /cart/update/:id (Auth Required)',
      'DELETE /cart/remove/:id (Auth Required)',
      'DELETE /cart/clear (Auth Required)'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;