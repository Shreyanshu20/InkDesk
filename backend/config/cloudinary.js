console.log('🔧 Starting Cloudinary configuration...');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Debug environment variables
console.log('CLOUDINARY_CLOUD_NAME exists:', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY exists:', !!process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET exists:', !!process.env.CLOUDINARY_API_SECRET);

let storage, upload;

try {
  // FIXED: Configure Cloudinary with direct values, not URL parsing
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Direct value: "dws2bgxzx"
      api_key: process.env.CLOUDINARY_API_KEY,       // Direct value: "931944444473962"
      api_secret: process.env.CLOUDINARY_API_SECRET, // Direct value: "rwydTciUZKbrJuKCDJ-alIsylLM"
      secure: true,
      timeout: 60000
    });
    
    console.log('✅ Configured Cloudinary with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
  } else {
    throw new Error('Missing Cloudinary environment variables');
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
  
  // Fallback upload handlers
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

// Test the connection AFTER configuration
const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
  }
};

// Call test on startup (after configuration)
testConnection();

module.exports = {
  cloudinary,
  upload,
};