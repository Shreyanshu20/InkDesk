const Product = require('../models/product.model');
const User = require('../models/User.model');

// ========== CART MANAGEMENT CONTROLLER FUNCTIONS ==========//
module.exports.addToCart = async (req, res) => {
  try {
    const { product_id: productId, quantity = 1 } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to add items to cart'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.product_stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.product_stock} items available in stock`
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingItemIndex = user.shopping_cart.findIndex(
      item => item.product_id.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = user.shopping_cart[existingItemIndex].quantity + quantity;

      if (newQuantity > product.product_stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${product.product_stock} available in stock`
        });
      }

      user.shopping_cart[existingItemIndex].quantity = newQuantity;
      user.shopping_cart[existingItemIndex].price = product.product_price * newQuantity;
    } else {
      const cartItem = {
        product_id: productId,
        quantity: quantity,
        price: product.product_price * quantity,
        added_at: new Date()
      };

      user.shopping_cart.push(cartItem);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: existingItemIndex > -1 ? 'Cart updated successfully' : 'Item added to cart successfully',
      cartItemsCount: user.shopping_cart.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

module.exports.getCartItems = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to view cart'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.shopping_cart.length === 0) {
      return res.json({
        success: true,
        cartItems: [],
        summary: {
          totalItems: 0,
          totalPrice: 0,
          itemCount: 0
        }
      });
    }

    const cartItemsWithProducts = [];

    for (let i = 0; i < user.shopping_cart.length; i++) {
      const cartItem = user.shopping_cart[i];

      try {
        const product = await Product.findById(cartItem.product_id);

        if (product) {
          cartItemsWithProducts.push({
            _id: cartItem._id,
            product_id: {
              _id: product._id,
              product_name: product.product_name,
              product_brand: product.product_brand,
              product_image: product.product_image,
              product_price: product.product_price,
              product_stock: product.product_stock,
              product_category: product.product_category
            },
            quantity: cartItem.quantity,
            price: cartItem.price,
            added_at: cartItem.added_at
          });
        }
      } catch (productError) {
        continue;
      }
    }

    const totalPrice = cartItemsWithProducts.reduce((sum, item) => sum + item.price, 0);
    const totalItems = cartItemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);

    const response = {
      success: true,
      cartItems: cartItemsWithProducts,
      summary: {
        totalItems,
        totalPrice,
        itemCount: cartItemsWithProducts.length
      }
    };

    res.json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
};

module.exports.getCartCount = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: true,
        count: 0
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: true,
        count: 0
      });
    }

    const totalItems = user.shopping_cart.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);

    res.json({
      success: true,
      count: totalItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting cart count',
      error: error.message
    });
  }
};

module.exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to update cart'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const user = await User.findById(userId).populate('shopping_cart.product_id');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.shopping_cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (!cartItem.product_id) {
      user.shopping_cart.pull(cartItemId);
      await user.save();

      return res.status(404).json({
        success: false,
        message: 'Product no longer available. Item removed from cart.'
      });
    }

    if (quantity > cartItem.product_id.product_stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product_id.product_stock} items available`
      });
    }

    cartItem.quantity = quantity;
    cartItem.price = cartItem.product_id.product_price * quantity;

    await user.save();

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to remove items from cart'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const initialLength = user.shopping_cart.length;
    user.shopping_cart.pull(cartItemId);

    if (user.shopping_cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    await User.findByIdAndUpdate(userId, {
      $set: { shopping_cart: [] }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};
