const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

module.exports.uploadProductImages = async (req, res) => {
  try {
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
          { quality: 'auto:good' },
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        // Silent cleanup
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
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          // Silent cleanup
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
    res.status(500).json({
      success: false,
      message: 'Failed to delete product image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports.uploadCategoryImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'inkdesk/categories',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        // Silent cleanup
      }
    });

    const images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt_text: `Category Image ${index + 1}`
    }));

    res.json({
      success: true,
      images,
      message: `Successfully uploaded ${images.length} image(s)`
    });

  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          // Silent cleanup
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

module.exports.deleteCategoryImage = async (req, res) => {
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
        message: 'Category image deleted successfully',
        result: deleteResult
      });
    } else {
      throw new Error('Failed to delete from Cloudinary');
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports.uploadSubcategoryImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'inkdesk/subcategories',
        transformation: [
          { width: 600, height: 400, crop: 'limit' },
          { quality: 'auto:best' },
          { format: 'auto:best' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        // Silent cleanup
      }
    });

    const images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt_text: `Subcategory Image ${index + 1}`
    }));

    res.json({
      success: true,
      images,
      message: `Successfully uploaded ${images.length} image(s)`
    });

  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          // Silent cleanup
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

module.exports.deleteSubcategoryImage = async (req, res) => {
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
        message: 'Subcategory image deleted successfully',
        result: deleteResult
      });
    } else {
      throw new Error('Failed to delete from Cloudinary');
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports.uploadBannerImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload(file.path, {
        folder: 'inkdesk/banners',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'auto' }
        ]
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Cleanup temp files
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        // Silent cleanup
      }
    });

    const images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt_text: `Banner Image ${index + 1}`
    }));

    res.json({
      success: true,
      images,
      message: `Successfully uploaded ${images.length} banner image(s)`
    });

  } catch (error) {
    // Cleanup temp files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          // Silent cleanup
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading banner images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports.deleteBannerImage = async (req, res) => {
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
        message: 'Banner image deleted successfully',
        result: deleteResult
      });
    } else {
      throw new Error('Failed to delete from Cloudinary');
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};