const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { userAuth } = require('../middleware/userAuth');

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'inkdesk/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto' }
    ]
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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
    message: 'Upload route is working!',
    timestamp: new Date().toISOString()
  });
});

// Upload single image
router.post('/image', userAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageData = {
      url: req.file.path,
      public_id: req.file.filename,
      alt_text: req.body.alt_text || ''
    };

    console.log('✅ Single image uploaded:', imageData);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: imageData
    });

  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload multiple product images
router.post('/product-images', userAuth, upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      alt_text: '' // Can be customized later
    }));

    console.log(`✅ ${images.length} product images uploaded:`, images);

    res.json({
      success: true,
      message: `${images.length} images uploaded successfully`,
      images
    });

  } catch (error) {
    console.error('❌ Error uploading product images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Delete single image by public_id
router.delete('/product-images/:publicId', userAuth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    console.log('🗑️ Attempting to delete image with public_id:', publicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('🗑️ Cloudinary deletion result:', result);

    if (result.result === 'ok' || result.result === 'not found') {
      res.json({
        success: true,
        message: 'Image deleted successfully',
        result: result.result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image from Cloudinary',
        result: result.result
      });
    }

  } catch (error) {
    console.error('❌ Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Delete multiple images
router.delete('/product-images', userAuth, async (req, res) => {
  try {
    const { publicIds } = req.body;
    
    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Public IDs array is required'
      });
    }

    console.log('🗑️ Attempting to delete multiple images:', publicIds);

    // Delete from Cloudinary
    const deletePromises = publicIds.map(publicId => 
      cloudinary.uploader.destroy(publicId)
    );
    
    const results = await Promise.allSettled(deletePromises);
    
    const successful = results.filter(result => 
      result.status === 'fulfilled' && 
      (result.value.result === 'ok' || result.value.result === 'not found')
    ).length;

    console.log(`🗑️ Successfully deleted ${successful}/${publicIds.length} images`);

    res.json({
      success: true,
      message: `Successfully deleted ${successful}/${publicIds.length} images`,
      results: results.map(result => ({
        status: result.status,
        result: result.status === 'fulfilled' ? result.value.result : result.reason?.message
      }))
    });

  } catch (error) {
    console.error('❌ Error deleting multiple images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete images',
      error: error.message
    });
  }
});

// Get image info by public_id
router.get('/image-info/:publicId', userAuth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.api.resource(publicId);
    
    res.json({
      success: true,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at
      }
    });

  } catch (error) {
    console.error('❌ Error getting image info:', error);
    res.status(404).json({
      success: false,
      message: 'Image not found',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 6 files allowed'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Upload error'
  });
});

module.exports = router;