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

// Upload image endpoint
router.post('/image', userAuth, upload.single('image'), uploadController.uploadImage);

module.exports = router;