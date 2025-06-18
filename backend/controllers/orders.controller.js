const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { transporter } = require('../config/nodemailer');

// Helper function to calculate order totals - CORRECTED TO MATCH FRONTEND
const calculateOrderTotals = (subtotal) => {
  // Free shipping threshold - ₹999 (not ₹99)
  const freeShippingThreshold = 999;

  // Shipping cost - ₹99 if under threshold, else free (not ₹50)
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;

  // Tax calculation (GST 18%)
  const tax = Math.round(subtotal * 0.18 * 100) / 100;

  // Total amount
  const total = subtotal + shipping + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    tax,
    total: Math.round(total * 100) / 100,
    freeShippingThreshold
  };
};

// Format price in INR for emails
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);
};

// Create order with email notification
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, shipping_address } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    let itemsTotal = 0;
    const orderItems = [];
    const orderProducts = [];

    // Process each item and calculate items total
    for (const item of items) {
      if (!item.product_id || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product_id and quantity'
        });
      }

      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product_id}`
        });
      }

      // Check stock
      if (product.product_stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}. Available: ${product.product_stock}, Requested: ${item.quantity}`
        });
      }

      const itemTotal = product.product_price * item.quantity;
      itemsTotal += itemTotal;

      orderItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price: product.product_price
      });

      orderProducts.push({
        name: product.product_name,
        brand: product.product_brand,
        price: product.product_price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Calculate actual total with shipping and tax - CORRECTED
    const totals = calculateOrderTotals(itemsTotal);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order with actual total amount
    const order = new Order({
      user_id: userId,
      order_number: orderNumber,
      items: orderItems,
      total_amount: totals.total, // This now includes correct shipping + tax
      shipping_address: {
        name: shipping_address.name || 'N/A',
        address: shipping_address.address || 'N/A',
        city: shipping_address.city || 'N/A',
        phone: shipping_address.phone || 'N/A'
      },
      status: 'pending'
    });

    const savedOrder = await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { product_stock: -item.quantity } }
      );
    }

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { $set: { shopping_cart: [] } });

    // Send order confirmation email
    try {
      const shippingMessage = totals.shipping === 0
        ? `Free shipping (order over ${formatPrice(totals.freeShippingThreshold)})`
        : formatPrice(totals.shipping);

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `Order Confirmation - ${orderNumber}`,
        text: `
Order Confirmation - InkDesk

Dear ${user.name || user.first_name || 'Customer'},

Thank you for your order!

Order Details:
- Order Number: ${orderNumber}
- Order Date: ${new Date().toLocaleDateString('en-IN')}
- Status: Pending

Order Summary:
- Subtotal: ${formatPrice(totals.subtotal)}
- Shipping: ${shippingMessage}
- GST (18%): ${formatPrice(totals.tax)}
- Total Amount: ${formatPrice(totals.total)}

Items Ordered:
${orderProducts.map(product => `- ${product.name} by ${product.brand} (Qty: ${product.quantity}) - ${formatPrice(product.total)}`).join('\n')}

Shipping Address:
${shipping_address.name}
${shipping_address.address}
${shipping_address.city}
Phone: ${shipping_address.phone}

Thank you for shopping with InkDesk!

Best regards,
The InkDesk Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Order Confirmation - InkDesk</h2>
            <p>Dear <strong>${user.name || user.first_name || 'Customer'}</strong>,</p>
            <p>Thank you for your order!</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Order Number:</strong> ${orderNumber}</li>
                <li><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</li>
                <li><strong>Status:</strong> Pending</li>
              </ul>
            </div>

            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">Subtotal:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatPrice(totals.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">Shipping:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; color: ${totals.shipping === 0 ? 'green' : 'inherit'};">${shippingMessage}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">GST (18%):</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatPrice(totals.tax)}</td>
                </tr>
                <tr style="font-size: 18px; color: #007bff;">
                  <td style="padding: 12px 0; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: bold;">${formatPrice(totals.total)}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #333;">Items Ordered:</h3>
            ${orderProducts.map(product => `
              <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #fff;">
                <strong style="color: #333;">${product.name}</strong> by ${product.brand}<br>
                <span style="color: #666;">Price: ${formatPrice(product.price)} × ${product.quantity} = <strong style="color: #007bff;">${formatPrice(product.total)}</strong></span>
              </div>
            `).join('')}

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Shipping Address:</h3>
              <p style="margin: 0; line-height: 1.6;">
                <strong>${shipping_address.name}</strong><br>
                ${shipping_address.address}<br>
                ${shipping_address.city}<br>
                Phone: ${shipping_address.phone}
              </p>
            </div>

            <p style="color: #666;">Thank you for shopping with InkDesk!</p>
            <p><strong style="color: #333;">The InkDesk Team</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log("Order confirmation email sent successfully");

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: savedOrder._id,
        order_number: savedOrder.order_number,
        total_amount: savedOrder.total_amount,
        status: savedOrder.status
      },
      breakdown: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        freeShippingThreshold: totals.freeShippingThreshold
      }
    });

  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user_id: userId })
      .populate('items.product_id', 'product_name product_image product_price product_brand')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, user_id: userId })
      .populate('items.product_id', 'product_name product_image product_price product_brand');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, user_id: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { product_stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// Buy Now order function
const buyNowOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { product_id, quantity, shipping_address } = req.body;

    // Validate required fields
    if (!product_id || !quantity || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, quantity, and shipping address are required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get product details
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.product_stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.product_stock}, Requested: ${quantity}`
      });
    }

    const itemsTotal = product.product_price * quantity;

    // Calculate actual total with shipping and tax - CORRECTED
    const totals = calculateOrderTotals(itemsTotal);

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order with actual total amount
    const order = new Order({
      user_id: userId,
      order_number: orderNumber,
      items: [{
        product_id: product._id,
        quantity: quantity,
        price: product.product_price
      }],
      total_amount: totals.total, // This now includes correct shipping + tax
      shipping_address: {
        name: shipping_address.name || 'N/A',
        address: shipping_address.address || 'N/A',
        city: shipping_address.city || 'N/A',
        phone: shipping_address.phone || 'N/A'
      },
      status: 'pending'
    });

    const savedOrder = await order.save();

    // Update product stock
    await Product.findByIdAndUpdate(
      product_id,
      { $inc: { product_stock: -quantity } }
    );

    // Send email
    try {
      const shippingMessage = totals.shipping === 0
        ? `Free shipping (order over ${formatPrice(totals.freeShippingThreshold)})`
        : formatPrice(totals.shipping);

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `Order Confirmation - ${orderNumber}`,
        text: `
Order Confirmation - InkDesk

Dear ${user.name || user.first_name || 'Customer'},

Thank you for your order!

Order Details:
- Order Number: ${orderNumber}
- Product: ${product.product_name} by ${product.product_brand}
- Quantity: ${quantity}
- Item Price: ${formatPrice(product.product_price)}

Order Summary:
- Subtotal: ${formatPrice(totals.subtotal)}
- Shipping: ${shippingMessage}
- GST (18%): ${formatPrice(totals.tax)}
- Total Amount: ${formatPrice(totals.total)}

Shipping Address:
${shipping_address.name}
${shipping_address.address}
${shipping_address.city}
Phone: ${shipping_address.phone}

Thank you for shopping with InkDesk!

Best regards,
The InkDesk Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Order Confirmation - InkDesk</h2>
            <p>Dear <strong>${user.name || user.first_name || 'Customer'}</strong>,</p>
            <p>Thank you for your order!</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Order Number:</strong> ${orderNumber}</li>
                <li><strong>Product:</strong> ${product.product_name} by ${product.product_brand}</li>
                <li><strong>Quantity:</strong> ${quantity}</li>
                <li><strong>Item Price:</strong> ${formatPrice(product.product_price)}</li>
              </ul>
            </div>

            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Summary:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">Subtotal:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatPrice(totals.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">Shipping:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; color: ${totals.shipping === 0 ? 'green' : 'inherit'};">${shippingMessage}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">GST (18%):</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${formatPrice(totals.tax)}</td>
                </tr>
                <tr style="font-size: 18px; color: #007bff;">
                  <td style="padding: 12px 0; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: bold;">${formatPrice(totals.total)}</td>
                </tr>
              </table>
            </div>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Shipping Address:</h3>
              <p style="margin: 0; line-height: 1.6;">
                <strong>${shipping_address.name}</strong><br>
                ${shipping_address.address}<br>
                ${shipping_address.city}<br>
                Phone: ${shipping_address.phone}
              </p>
            </div>

            <p style="color: #666;">Thank you for shopping with InkDesk!</p>
            <p><strong style="color: #333;">The InkDesk Team</strong></p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log("Buy Now order confirmation email sent successfully");
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        _id: savedOrder._id,
        order_number: savedOrder.order_number,
        total_amount: savedOrder.total_amount,
        status: savedOrder.status
      },
      breakdown: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        freeShippingThreshold: totals.freeShippingThreshold
      }
    });

  } catch (error) {
    console.error('Buy Now order error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ========== ADMIN ORDER MANAGEMENT FUNCTIONS ==========

const getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('🔍 Admin orders request:', {
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder
    });

    // Build query for ALL orders (not filtered by seller)
    let query = {};

    // Add status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      // Find users matching search terms
      const matchingUsers = await User.find({
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');

      const matchingUserIds = matchingUsers.map(u => u._id);

      query.$or = [
        { order_number: searchRegex },
        { user_id: { $in: matchingUserIds } },
        { 'shipping_address.name': searchRegex }
      ];
    }

    // Build sort object
    let sortObject = {};
    if (sortBy === 'user_id') {
      sortObject.createdAt = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'total_amount') {
      sortObject.total_amount = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('📊 Query:', JSON.stringify(query, null, 2));
    console.log('🔄 Sort:', sortObject);

    // Get ALL orders with pagination
    const orders = await Order.find(query)
      .populate('user_id', 'first_name last_name email phone')
      .populate({
        path: 'items.product_id',
        select: 'product_name product_price product_image owner'
      })
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const totalOrders = await Order.countDocuments(query);

    console.log(`📦 Found ${orders.length} orders total: ${totalOrders}`);

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / parseInt(limit)),
      totalOrders,
      hasNextPage: parseInt(page) < Math.ceil(totalOrders / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    };

    res.json({
      success: true,
      orders: orders,
      pagination
    });

  } catch (error) {
    console.error('❌ Error fetching admin orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

const getAdminOrderStats = async (req, res) => {
  try {
    console.log('📊 Getting order stats for all orders');

    // Get ALL orders (not filtered by seller)
    const orders = await Order.find({}).select('status');

    // Calculate statistics
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    console.log('📈 Order stats:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};

const getAdminOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    console.log('🔍 Getting order details:', orderId);

    const order = await Order.findById(orderId)
      .populate('user_id', 'first_name last_name email phone')
      .populate('items.product_id', 'product_name product_price product_image owner');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

const updateAdminOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    console.log(`✅ Updated order ${orderId} status to ${status}`);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

const deleteAdminOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log(`🗑️ Deleted order ${orderId}`);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
};

module.exports = {
  // Existing exports
  getUserOrders,
  getOrderDetails,
  createOrder,
  cancelOrder,
  buyNowOrder,

  // New admin exports
  getAdminOrders,
  getAdminOrderStats,
  getAdminOrderById,
  updateAdminOrderStatus,
  deleteAdminOrder
};