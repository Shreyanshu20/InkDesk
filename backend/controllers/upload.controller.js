const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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