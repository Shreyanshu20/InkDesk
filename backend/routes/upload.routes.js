const express = require('express');
const multer = require('multer');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const uploadController = require('../controllers/upload.controller');

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// ========== PRODUCT IMAGE UPLOAD ROUTES ==========//
router.post('/product-images', userAuth, upload.array('images', 6), uploadController.uploadProductImages);
router.delete('/product-images/:publicId', userAuth, uploadController.deleteProductImage);

// ========== CATEGORY IMAGE UPLOAD ROUTES ==========//
router.post('/category-images', userAuth, upload.array('images', 1), uploadController.uploadCategoryImages);
router.delete('/category-images/:publicId', userAuth, uploadController.deleteCategoryImage);

// ========== SUBCATEGORY IMAGE UPLOAD ROUTES ==========//
router.post('/subcategory-images', userAuth, upload.array('images', 1), uploadController.uploadSubcategoryImages);
router.delete('/subcategory-images/:publicId', userAuth, uploadController.deleteSubcategoryImage);

// ========== BANNER IMAGE UPLOAD ROUTES ==========//
router.post('/banner-image', userAuth, upload.array('images', 2), uploadController.uploadBannerImages);
router.delete('/banner-images/:publicId', userAuth, uploadController.deleteBannerImage);

module.exports = router;