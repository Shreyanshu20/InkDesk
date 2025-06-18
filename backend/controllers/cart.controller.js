const Product = require('../models/product.model');
const User = require('../models/user.model');

// Add item to cart - Direct to user shopping_cart
const addToCart = async (req, res) => {
  try {
    console.log('🛒 Direct cart add request received');
    console.log('📥 Request body:', req.body);
    console.log('👤 User ID:', req.userId);

    const { product_id: productId, quantity = 1 } = req.body;
    const userId = req.userId;

    // Validate inputs
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

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.product_stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.product_stock} items available in stock`
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = user.shopping_cart.findIndex(
      item => item.product_id.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity = user.shopping_cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.product_stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${product.product_stock} available in stock`
        });
      }

      user.shopping_cart[existingItemIndex].quantity = newQuantity;
      user.shopping_cart[existingItemIndex].price = product.product_price * newQuantity;
      
      console.log('✅ Updated existing cart item');
    } else {
      // Add new item to cart
      const cartItem = {
        product_id: productId,
        quantity: quantity,
        price: product.product_price * quantity,
        added_at: new Date()
      };

      user.shopping_cart.push(cartItem);
      console.log('✅ Added new item to cart');
    }

    // Save user
    await user.save();

    console.log('✅ User shopping_cart updated. Total items:', user.shopping_cart.length);

    res.status(200).json({
      success: true,
      message: existingItemIndex > -1 ? 'Cart updated successfully' : 'Item added to cart successfully',
      cartItemsCount: user.shopping_cart.length
    });

  } catch (error) {
    console.error('❌ Direct cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Get cart items - Direct from user shopping_cart
const getCartItems = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to view cart'
      });
    }

    console.log('🔍 Fetching cart items for user:', userId);

    // Get user WITHOUT populate first
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('🔍 User shopping_cart raw:', user.shopping_cart);
    console.log('🔍 User shopping_cart length:', user.shopping_cart.length);

    if (user.shopping_cart.length === 0) {
      console.log('🔍 Shopping cart is empty');
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

    // Manually fetch products for each cart item
    const cartItemsWithProducts = [];

    for (let i = 0; i < user.shopping_cart.length; i++) {
      const cartItem = user.shopping_cart[i];
      console.log(`🔍 Processing cart item ${i}:`, cartItem);

      try {
        const product = await Product.findById(cartItem.product_id);
        
        if (product) {
          console.log(`🔍 Found product: ${product.product_name}`);
          
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
        } else {
          console.log(`❌ Product not found for ID: ${cartItem.product_id}`);
        }
      } catch (productError) {
        console.error(`❌ Error fetching product ${cartItem.product_id}:`, productError);
      }
    }

    console.log('🔍 Cart items with products:', cartItemsWithProducts.length);

    // Calculate totals
    const totalPrice = cartItemsWithProducts.reduce((sum, item) => sum + item.price, 0);
    const totalItems = cartItemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);

    console.log('🔍 Cart summary - Total Price:', totalPrice, 'Total Items:', totalItems);

    const response = {
      success: true,
      cartItems: cartItemsWithProducts,
      summary: {
        totalItems,
        totalPrice,
        itemCount: cartItemsWithProducts.length
      }
    };

    console.log('🔍 Sending response with cart items:', cartItemsWithProducts.length);

    res.json(response);

  } catch (error) {
    console.error('❌ Error fetching cart items:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
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

    // Get user
    const user = await User.findById(userId).populate('shopping_cart.product_id');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find cart item by subdocument ID
    const cartItem = user.shopping_cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check if product still exists
    if (!cartItem.product_id) {
      user.shopping_cart.pull(cartItemId);
      await user.save();
      
      return res.status(404).json({
        success: false,
        message: 'Product no longer available. Item removed from cart.'
      });
    }

    // Check stock
    if (quantity > cartItem.product_id.product_stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product_id.product_stock} items available`
      });
    }

    // Update quantity and price
    cartItem.quantity = quantity;
    cartItem.price = cartItem.product_id.product_price * quantity;

    await user.save();

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to remove items from cart'
      });
    }

    console.log('🗑️ Removing cart item:', cartItemId, 'for user:', userId);

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

    console.log('✅ Cart item removed. Remaining items:', user.shopping_cart.length);

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
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
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

// Get cart count
const getCartCount = async (req, res) => {
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

    // Calculate total items
    const totalItems = user.shopping_cart.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);

    res.json({
      success: true,
      count: totalItems
    });

  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cart count',
      error: error.message
    });
  }
};

// Test route - Add a test item to cart
const testAddToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const User = require('../models/user.model');
    const Product = require('../models/product.model');
    
    // Get first available product
    const product = await Product.findOne();
    if (!product) {
      return res.json({ success: false, message: 'No products found' });
    }
    
    const user = await User.findById(userId);
    
    // Add test item
    user.shopping_cart.push({
      product_id: product._id,
      quantity: 1,
      price: product.product_price,
      added_at: new Date()
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Test item added',
      cartLength: user.shopping_cart.length,
      addedProduct: product.product_name
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  testAddToCart
};