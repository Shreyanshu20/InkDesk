const Banner = require('../models/banner.model.js');

// Get banners for frontend (public endpoint)
module.exports.getBanners = async (req, res) => {
  try {
    console.log('🎯 Public banners request');
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
      .select('title subtitle image mobileImage url buttonText textPosition location position');
    
    console.log(`✅ Found ${banners.length} active banners`);
    
    return res.json({
      success: true,
      banners
    });
  } catch (error) {
    console.error('❌ Error fetching public banners:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners"
    });
  }
};

// Admin: Get all banners (READ - accessible by admin and user roles)
module.exports.getAdminBanners = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role;
    console.log(`🔑 Admin banners request - User: ${userId}, Role: ${userRole}`);
    
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
    
    console.log(`✅ Found ${banners.length} banners (${total} total) for admin panel`);
    
    return res.json({
      success: true,
      banners,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('❌ Error fetching admin banners:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners"
    });
  }
};

// Admin: Get single banner (READ - accessible by admin and user roles)
module.exports.getAdminBanner = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role;
    console.log(`🔍 Fetching banner ${req.params.id} - User: ${userId}, Role: ${userRole}`);
    
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      console.log('❌ Banner not found');
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    console.log('✅ Banner found successfully');
    
    return res.json({
      success: true,
      banner
    });
  } catch (error) {
    console.error('❌ Error fetching banner:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banner"
    });
  }
};

// Admin: Create banner (WRITE - admin only, protected by adminOnly middleware)
module.exports.createBanner = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role;
    console.log(`➕ Creating banner - User: ${userId}, Role: ${userRole}`);
    
    const bannerData = req.body;
    
    // Validate required fields
    if (!bannerData.title || !bannerData.location) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: "Title and location are required"
      });
    }
    
    // Add creator information
    const banner = new Banner({
      ...bannerData,
      createdBy: userId,
      updatedBy: userId
    });
    
    await banner.save();
    
    console.log('✅ Banner created successfully:', banner._id);
    
    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner
    });
  } catch (error) {
    console.error('❌ Error creating banner:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create banner",
      error: error.message
    });
  }
};

// Admin: Update banner (WRITE - admin only, protected by adminOnly middleware)
module.exports.updateBanner = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role;
    console.log(`✏️ Updating banner ${req.params.id} - User: ${userId}, Role: ${userRole}`);
    
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      console.log('❌ Banner not found');
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    // Add updater information
    const updateData = {
      ...req.body,
      updatedBy: userId,
      updatedAt: new Date()
    };
    
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('✅ Banner updated successfully');
    
    return res.json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner
    });
  } catch (error) {
    console.error('❌ Error updating banner:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update banner",
      error: error.message
    });
  }
};

// Admin: Delete banner (WRITE - admin only, protected by adminOnly middleware)
module.exports.deleteBanner = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role;
    console.log(`🗑️ Deleting banner ${req.params.id} - User: ${userId}, Role: ${userRole}`);
    
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      console.log('❌ Banner not found');
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    await Banner.findByIdAndDelete(req.params.id);
    
    console.log('✅ Banner deleted successfully');
    
    return res.json({
      success: true,
      message: "Banner deleted successfully"
    });
  } catch (error) {
    console.error('❌ Error deleting banner:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete banner",
      error: error.message
    });
  }
};

// Admin: Toggle banner status (WRITE - admin only, protected by adminOnly middleware)
module.exports.toggleBannerStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user?.role;
    console.log(`🔄 Toggling banner status ${req.params.id} - User: ${userId}, Role: ${userRole}`);
    
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      console.log('❌ Banner not found');
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    
    banner.isActive = !banner.isActive;
    banner.updatedBy = userId;
    banner.updatedAt = new Date();
    
    await banner.save();
    
    console.log(`✅ Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`);
    
    return res.json({
      success: true,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
      banner
    });
  } catch (error) {
    console.error('❌ Error toggling banner status:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle banner status",
      error: error.message
    });
  }
};