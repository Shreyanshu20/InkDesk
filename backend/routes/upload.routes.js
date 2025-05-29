const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Upload routes are working!' });
});

// Product images upload with timeout handling
router.post('/product-images', (req, res) => {
  console.log('🔥 Product upload route hit!');
  
  const { upload } = require('../config/cloudinary');
  
  // Set a timeout for the entire request
  req.setTimeout(120000); // 2 minutes
  
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('❌ Upload middleware error:', err.message);
      console.error('Error stack:', err.stack);
      
      return res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    console.log('✅ Files uploaded:', req.files.length);

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      alt_text: ''
    }));

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages
    });
  });
});

// Category image upload
router.post('/category-images', (req, res) => {
  console.log('🔥 Category upload route hit!');
  
  const { upload } = require('../config/cloudinary');
  
  req.setTimeout(120000); // 2 minutes
  
  upload.single('images')(req, res, (err) => {
    if (err) {
      console.error('❌ Category upload error:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Upload failed',
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('✅ Category file uploaded:', req.file.path);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      images: [{
        url: req.file.path,
        public_id: req.file.filename,
        alt_text: ''
      }]
    });
  });
});

// Delete category image route
router.delete('/category-images/:public_id', async (req, res) => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    const { public_id } = req.params;
    
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('❌ Category image delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;