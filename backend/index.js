require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// CORS Configuration 
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5000',
    'http://localhost:5173',    
    'http://localhost:5174',      
    'https://inkdesk-frontend.onrender.com',
    'https://inkdesk-admin.onrender.com',   
    'https://inkdesk-backend.onrender.com'
  ];

  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);
  if (process.env.ADMIN_URL) origins.push(process.env.ADMIN_URL);

  return [...new Set(origins)]; 
};


// Enhanced CORS configuration for SEPARATE DOMAIN cookies
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cookie' 
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 
}));

// specific middleware to handle cookies properly for SEPARATE DOMAINS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });


// Upload routes
try {
  app.use('/upload', require('./routes/upload.routes'));
  console.log('Upload routes registered at /upload ==> WORKING');
} catch (error) {
  console.error('Upload routes NOT WORKING:', error.message);
}

// Auth routes
try {
  const authRoutes = require('./routes/auth.routes.js');
  app.use('/auth', authRoutes);
  console.log('Auth routes loaded at /auth ==> WORKING');
} catch (error) {
  console.error('Auth routes NOT WORKING:', error.message);
}

// User routes
try {
  const userRoutes = require('./routes/user.routes');
  app.use('/user', userRoutes);
  console.log('User routes loaded at /user ==> WORKING');
} catch (error) {
  console.error('User routes NOT WORKING:', error.message);
}

// Product routes
try {
  const productRoutes = require('./routes/product.routes');
  app.use('/products', productRoutes);
  console.log('Product routes loaded at /products ==> WORKING');
} catch (error) {
  console.error('Product routes NOT WORKING:', error.message);
}

// Category routes
try {
  const categoryRoutes = require('./routes/category.routes');
  app.use('/categories', categoryRoutes);
  console.log('Category routes loaded at /categories ==> WORKING');
} catch (error) {
  console.error('Category routes NOT WORKING:', error.message);
}

// Cart routes
try {
  const cartRoutes = require('./routes/cart.routes');
  app.use('/cart', cartRoutes);
  console.log('Cart routes loaded at /cart ==> WORKING');
} catch (error) {
  console.error('Cart routes NOT WORKING:', error.message);
}

// Wishlist routes
try {
  const wishlistRoutes = require('./routes/wishlist.route');
  app.use('/wishlist', wishlistRoutes);
  console.log('Wishlist routes loaded at /wishlist ==> WORKING');
} catch (error) {
  console.error('Wishlist routes NOT WORKING:', error.message);
}

// Order routes
try {
  const orderRoutes = require('./routes/orders.routes');
  app.use('/orders', orderRoutes);
  console.log('Order routes loaded at /orders ==> WORKING');
} catch (error) {
  console.error('Order routes NOT WORKING:', error.message);
}

// Review routes
try {
  const reviewRoutes = require('./routes/review.routes.js');
  app.use('/reviews', reviewRoutes);
  console.log('Review routes loaded at /reviews ==> WORKING');
} catch (error) {
  console.error('Review routes NOT WORKING:', error.message);
}

// Banner routes
try {
  const bannerRoutes = require('./routes/banner.routes');
  app.use('/banners', bannerRoutes);
  console.log('Banner routes loaded at /banners ==> WORKING');
} catch (error) {
  console.error('Banner routes NOT WORKING:', error.message);
}

// Contact routes
try {
  const contactRoutes = require('./routes/contact.routes.js');
  app.use('/contact', contactRoutes);
  console.log('Contact routes loaded at /contact ==> WORKING');
} catch (error) {
  console.error('Contact routes NOT WORKING:', error.message);
}

// Admin routes
try {
  const adminRoutes = require('./routes/admin.routes');
  app.use('/admin', adminRoutes);
  console.log('Admin routes loaded at /admin ==> WORKING');
} catch (error) {
  console.error('Admin routes NOT WORKING:', error.message);
}

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
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});

module.exports = app;