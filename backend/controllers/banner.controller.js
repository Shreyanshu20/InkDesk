const Banner = require('../models/banner.model.js');

// Get banners for frontend (public endpoint)
module.exports.getBanners = async (req, res) => {
  try {
    const { location } = req.query;
    const now = new Date();
    
    const query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    };
    
    if (location) {
      query.location = location;
    }
    
    const banners = await Banner.find(query)
      .sort({ position: 1, createdAt: -1 })
      .select('title subtitle image mobileImage url buttonText textPosition location position'); // ADD position field
    
    return res.json({
      success: true,
      banners
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners"
    });
  }
};

// Admin: Get all banners
module.exports.getAdminBanners = async (req, res) => {
  try {
    const { location, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (location) {
      query.location = location;
    }
    
    const banners = await Banner.find(query)
      .sort({ position: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Banner.countDocuments(query);
    
    return res.json({
      success: true,
      banners,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners"
    });
  }
};

// Admin: Get single banner
module.exports.getAdminBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    return res.json({
      success: true,
      banner
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banner"
    });
  }
};

// Admin: Create banner
module.exports.createBanner = async (req, res) => {
  try {
    const bannerData = req.body;
    
    // Validate required fields
    if (!bannerData.title || !bannerData.location) {
      return res.status(400).json({
        success: false,
        message: "Title and location are required"
      });
    }
    
    const banner = new Banner(bannerData);
    await banner.save();
    
    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create banner"
    });
  }
};

// Admin: Update banner
module.exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    return res.json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update banner"
    });
  }
};

// Admin: Delete banner
module.exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    await Banner.findByIdAndDelete(req.params.id);
    
    return res.json({
      success: true,
      message: "Banner deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete banner"
    });
  }
};

// Admin: Toggle banner status
module.exports.toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    banner.isActive = !banner.isActive;
    await banner.save();
    
    return res.json({
      success: true,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
      banner
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle banner status"
    });
  }
};