const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

// Single image upload with HIGH QUALITY for banners
module.exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // HIGH QUALITY upload for banners/advertisements
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'inkdesk/banners',
      quality: 'auto:best', // CHANGE FROM 'auto:low' TO 'auto:best'
      format: 'auto',
      // Remove size restrictions for banners - keep original dimensions
      flags: 'preserve_transparency'
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
        alt_text: ''
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image"
    });
  }
};

// Category images with moderate quality
module.exports.uploadCategoryImages = async (req, res) => {
  try {
    console.log('📤 Category image upload request received');
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
        folder: 'inkdesk/categories',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto:good' }, // Good quality for categories
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Clean up temporary files
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.warn('Failed to delete temp file:', file.path);
      }
    });

    // Format response
    const images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt_text: `Category Image ${index + 1}`
    }));

    console.log('✅ Category image upload successful:', images.length);

    res.json({
      success: true,
      images,
      message: `Successfully uploaded ${images.length} image(s)`
    });

  } catch (error) {
    console.error('❌ Category image upload error:', error);
    
    // Clean up temp files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading category images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Upload subcategory images - ADD THIS FUNCTION
module.exports.uploadSubcategoryImages = async (req, res) => {
  try {
    console.log('📤 Subcategory image upload request received');
    console.log('📁 Files received:', req.files?.length || 0);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    // Upload each file to Cloudinary (should be only 1 for subcategories)
    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'subcategories',
        transformation: [
          { width: 600, height: 400, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Clean up temporary files
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.warn('Failed to delete temp file:', file.path);
      }
    });

    // Format response
    const images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt_text: `Subcategory Image ${index + 1}`
    }));

    console.log('✅ Subcategory image upload successful:', images.length);

    res.json({
      success: true,
      images,
      message: `Successfully uploaded ${images.length} image(s)`
    });

  } catch (error) {
    console.error('❌ Subcategory image upload error:', error);
    
    // Clean up temp files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading subcategory images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete category image - ADD THIS FUNCTION
module.exports.deleteCategoryImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    console.log('🗑️ Delete category image request for public_id:', publicId);

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
        message: 'Category image deleted successfully',
        result: deleteResult
      });
    } else {
      throw new Error('Failed to delete from Cloudinary');
    }

  } catch (error) {
    console.error('❌ Error deleting category image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete subcategory image - ADD THIS FUNCTION
module.exports.deleteSubcategoryImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    console.log('🗑️ Delete subcategory image request for public_id:', publicId);

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
        message: 'Subcategory image deleted successfully',
        result: deleteResult
      });
    } else {
      throw new Error('Failed to delete from Cloudinary');
    }

  } catch (error) {
    console.error('❌ Error deleting subcategory image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory image',
      error: process.env.NODE_ENV === 'development' ? error.message: undefined
    });
  }
};

// Upload product images (existing function - add if missing)
module.exports.uploadProductImages = async (req, res) => {
  try {
    console.log('📤 Product image upload request received');

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'inkdesk/products',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto:good' }, // Good quality for products
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Clean up temporary files
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.warn('Failed to delete temp file:', file.path);
      }
    });

    const images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt_text: `Product Image ${index + 1}`
    }));

    res.json({
      success: true,
      images,
      message: `Successfully uploaded ${images.length} image(s)`
    });

  } catch (error) {
    console.error('❌ Product image upload error:', error);
    
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading product images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete product image (existing function - add if missing)
module.exports.deleteProductImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId || publicId === 'undefined' || publicId === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid public_id provided'
      });
    }

    const deleteResult = await cloudinary.uploader.destroy(publicId);
    
    if (deleteResult.result === 'ok' || deleteResult.result === 'not found') {
      res.json({
        success: true,
        message: 'Product image deleted successfully',
        result: deleteResult
      });
    } else {
      throw new Error('Failed to delete from Cloudinary');
    }

  } catch (error) {
    console.error('❌ Error deleting product image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};