const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

let storage, upload;

try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
      timeout: 60000
    });
  } else {
    throw new Error('Missing Cloudinary environment variables');
  }

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: (req) => {
        if (req.originalUrl.includes('category-images')) return 'inkdesk/categories';
        if (req.originalUrl.includes('subcategory-images')) return 'inkdesk/subcategories';
        if (req.originalUrl.includes('product-images')) return 'inkdesk/products';
        return 'inkdesk/banners';
      },
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    }
  });

  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    },
  });

} catch (error) {
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