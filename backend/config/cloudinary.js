console.log('🔧 Starting Cloudinary configuration...');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the connection
const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
  }
};

// Call test on startup
testConnection();

// Debug environment variables
console.log('CLOUDINARY_CLOUD_NAME exists:', !!process.env.CLOUDINARY_CLOUD_NAME);

let storage, upload;

try {
  // Configure Cloudinary with explicit config
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const url = new URL(process.env.CLOUDINARY_CLOUD_NAME);
    
    cloudinary.config({
      cloud_name: url.hostname,
      api_key: url.username,
      api_secret: url.password,
      secure: true,
      timeout: 60000
    });
    
    console.log('✅ Configured Cloudinary with cloud_name:', url.hostname);
  } else {
    throw new Error('CLOUDINARY_CLOUD_NAME is required');
  }

  // HIGH QUALITY storage configuration for banners/advertisements
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: (req) => {
        if (req.originalUrl.includes('category-images')) return 'inkdesk/categories';
        if (req.originalUrl.includes('subcategory-images')) return 'inkdesk/subcategories';
        if (req.originalUrl.includes('product-images')) return 'inkdesk/products';
        return 'inkdesk/banners'; // Default for banner/advertisement images
      },
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      // REMOVE aggressive compression - keep original quality for banners
      transformation: [
        { quality: 'auto:best' }, // Use best quality instead of low
        { fetch_format: 'auto' }
      ]
    }
  });

  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // Increase to 10MB for high-quality banners
      files: 5
    },
    fileFilter: (req, file, cb) => {
      console.log('📁 File filter:', file.mimetype);
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    },
  });

  console.log('✅ Cloudinary config loaded with high quality settings');

} catch (error) {
  console.error('💥 Cloudinary configuration failed:', error.message);
  
  upload = {
    single: () => (req, res, next) => {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured',
        error: error.message
      });
    },
    array: () => (req, res, next) => {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured',
        error: error.message
      });
    }
  };
}

module.exports = {
  cloudinary,
  upload,
};