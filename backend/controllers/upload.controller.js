const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Existing banner image upload function (keeping as is)
module.exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'banners',
      transformation: [
        { width: 1200, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    return res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image"
    });
  }
};

// NEW: Upload multiple product images
module.exports.uploadProductImages = async (req, res) => {
  try {
    console.log('📤 Product image upload request received');
    console.log('📁 Files received:', req.files?.length || 0);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    // Upload each file to Cloudinary
    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Format the response
    const uploadedImages = uploadResults.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }));

    console.log('✅ Images uploaded successfully:', uploadedImages.length);

    res.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      images: uploadedImages
    });

  } catch (error) {
    console.error('❌ Product upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB per image.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 6 images allowed.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// NEW: Delete product image
module.exports.deleteProductImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    console.log('🗑️ Delete request for public_id:', publicId);

    if (!publicId || publicId === 'undefined' || publicId === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid public_id provided'
      });
    }

    // Delete from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    
    console.log('🗑️ Cloudinary deletion result:', deleteResult);

    if (deleteResult.result === 'ok' || deleteResult.result === 'not found') {
      res.json({
        success: true,
        message: 'Image deleted successfully',
        result: deleteResult
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image from Cloudinary',
        result: deleteResult
      });
    }

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};