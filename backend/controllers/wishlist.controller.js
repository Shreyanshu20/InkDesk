const User = require('../models/User.model');
const Product = require('../models/product.model');

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.userId;

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Get user and check if product already in wishlist
    const user = await User.findById(user_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(product_id)) {
      return res.json({ success: false, message: "Product already in wishlist" });
    }

    // Add to wishlist
    user.wishlist.push(product_id);
    await user.save();

    // Get updated wishlist with populated products for frontend
    const updatedUser = await User.findById(user_id)
      .populate({
        path: 'wishlist',
        select: 'product_name product_price product_image product_brand product_stock product_rating product_discount'
      });

    // Transform data to match frontend expectations
    const wishlistItems = updatedUser.wishlist.map(product => ({
      _id: Math.random().toString(36),
      product_id: product,
      user_id: user_id
    }));

    res.json({ 
      success: true, 
      message: "Product added to wishlist",
      wishlist: wishlistItems
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ success: false, message: "Failed to add to wishlist" });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user_id = req.userId;

    const user = await User.findById(user_id)
      .populate({
        path: 'wishlist',
        select: 'product_name product_price product_image product_brand product_stock product_rating product_discount'
      });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Transform data to match frontend expectations
    const wishlistItems = user.wishlist.map(product => ({
      _id: Math.random().toString(36),
      product_id: product,
      user_id: user_id
    }));

    res.json({ 
      success: true, 
      wishlist: wishlistItems,
      count: user.wishlist.length 
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ success: false, message: "Failed to get wishlist" });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params; // Get from URL params instead of body
    const user_id = req.userId;

    const user = await User.findById(user_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if product is in wishlist
    const productIndex = user.wishlist.indexOf(product_id);
    if (productIndex === -1) {
      return res.json({ success: false, message: "Product not found in wishlist" });
    }

    // Remove from wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    // Get updated wishlist with populated products for frontend
    const updatedUser = await User.findById(user_id)
      .populate({
        path: 'wishlist',
        select: 'product_name product_price product_image product_brand product_stock product_rating product_discount'
      });

    // Transform data to match frontend expectations
    const wishlistItems = updatedUser.wishlist.map(product => ({
      _id: Math.random().toString(36),
      product_id: product,
      user_id: user_id
    }));

    res.json({ 
      success: true, 
      message: "Product removed from wishlist",
      wishlist: wishlistItems
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ success: false, message: "Failed to remove from wishlist" });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};