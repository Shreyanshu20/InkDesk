const User = require('../models/User.model');
const Product = require('../models/product.model');

module.exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.userId;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.wishlist.includes(product_id)) {
      return res.json({ success: false, message: "Product already in wishlist" });
    }

    user.wishlist.push(product_id);
    await user.save();

    const updatedUser = await User.findById(user_id)
      .populate({
        path: 'wishlist',
        select: 'product_name product_price product_image product_brand product_stock product_rating product_discount'
      });

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
    res.status(500).json({ success: false, message: "Failed to add to wishlist" });
  }
};

module.exports.getWishlist = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Failed to get wishlist" });
  }
};

module.exports.removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.userId;

    const user = await User.findById(user_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const productIndex = user.wishlist.indexOf(product_id);
    if (productIndex === -1) {
      return res.json({ success: false, message: "Product not found in wishlist" });
    }

    user.wishlist.splice(productIndex, 1);
    await user.save();

    const updatedUser = await User.findById(user_id)
      .populate({
        path: 'wishlist',
        select: 'product_name product_price product_image product_brand product_stock product_rating product_discount'
      });

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
    res.status(500).json({ success: false, message: "Failed to remove from wishlist" });
  }
}
