console.log('🔧 Starting Cloudinary configuration...');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Debug environment variables
console.log('CLOUDINARY_URL exists:', !!process.env.CLOUDINARY_URL);

let storage, upload;

try {
  // Configure Cloudinary with explicit config
  if (process.env.CLOUDINARY_URL) {
    const url = new URL(process.env.CLOUDINARY_URL);
    
    cloudinary.config({
      cloud_name: url.hostname,
      api_key: url.username,
      api_secret: url.password,
      secure: true,
      timeout: 60000
    });
    
    console.log('✅ Configured Cloudinary with cloud_name:', url.hostname);
  } else {
    throw new Error('CLOUDINARY_URL is required');
  }

  // Simple storage configuration without complex transformations
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: (req) => {
        return req.originalUrl.includes('category-images') ? 'inkdesk/categories' : 'inkdesk/products';
      },
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto:low', fetch_format: 'auto' }] // Minimal transformation
    }
  });

  upload = multer({
    storage: storage,
    limits: {
      fileSize: 3 * 1024 * 1024, // Reduce to 3MB
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

  console.log('✅ Cloudinary config loaded');

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