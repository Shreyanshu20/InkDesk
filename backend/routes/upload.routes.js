const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/upload.controller.js');
const { userAuth } = require('../middleware/userAuth.js');

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


// Upload Product images
router.post('/product-images', userAuth, upload.array('images', 6), uploadController.uploadProductImages);

// Delete product image
router.delete('/product-images/:publicId', userAuth, uploadController.deleteProductImage);

// Upload Category images
router.post('/category-images', userAuth, upload.array('images', 1), uploadController.uploadCategoryImages);

// Delete category image
router.delete('/category-images/:publicId', userAuth, uploadController.deleteCategoryImage);

// Upload Subcategory images
router.post('/subcategory-images', userAuth, upload.array('images', 1), uploadController.uploadSubcategoryImages);

// Delete subcategory image
router.delete('/subcategory-images/:publicId', userAuth, uploadController.deleteSubcategoryImage);

// Upload Banner images
router.post('/banner-image', userAuth, upload.array('images', 2), uploadController.uploadBannerImages);

// Delete banner image
router.delete('/banner-images/:publicId', userAuth, uploadController.deleteBannerImage);

module.exports = router;