const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/upload.controller.js');
const { userAuth } = require('../middleware/userAuth.js');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Upload single image endpoint (for categories)
router.post('/image', userAuth, upload.single('image'), uploadController.uploadImage);

// Category image upload routes
router.post('/category-images', userAuth, upload.array('images', 1), uploadController.uploadCategoryImages);
router.delete('/category-images/:publicId', userAuth, uploadController.deleteCategoryImage);

// Subcategory image upload routes  
router.post('/subcategory-images', userAuth, upload.array('images', 1), uploadController.uploadSubcategoryImages);
router.delete('/subcategory-images/:publicId', userAuth, uploadController.deleteSubcategoryImage);

// Upload product images
router.post('/product-images', userAuth, upload.array('images', 6), uploadController.uploadProductImages);
router.delete('/product-images/:publicId', userAuth, uploadController.deleteProductImage);

module.exports = router;