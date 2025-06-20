const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { transporter } = require('../config/nodemailer');
const { orderConfirmationTemplate } = require('../config/orderEmailTemplate');

const calculateOrderTotals = (subtotal) => {
  const freeShippingThreshold = 999;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    tax,
    total: Math.round(total * 100) / 100,
    freeShippingThreshold
  };
};

module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, shipping_address } = req.body;

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

    const totals = calculateOrderTotals(itemsTotal);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      user_id: userId,
      order_number: orderNumber,
      items: orderItems,
      total_amount: totals.total,
      shipping_address: {
        name: shipping_address.name || 'N/A',
        address: shipping_address.address || 'N/A',
        city: shipping_address.city || 'N/A',
        phone: shipping_address.phone || 'N/A'
      },
      status: 'pending'
    });

    const savedOrder = await order.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { product_stock: -item.quantity } }
      );
    }

    await User.findByIdAndUpdate(userId, { $set: { shopping_cart: [] } });

    try {
      const emailTemplate = orderConfirmationTemplate(user, savedOrder, orderProducts, shipping_address, totals);
      
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      // Email error silently handled
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
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports.getUserOrders = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

module.exports.getOrderDetails = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};

module.exports.cancelOrder = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

module.exports.buyNowOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { product_id, quantity, shipping_address } = req.body;

    if (!product_id || !quantity || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, quantity, and shipping address are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.product_stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.product_stock}, Requested: ${quantity}`
      });
    }

    const itemsTotal = product.product_price * quantity;
    const totals = calculateOrderTotals(itemsTotal);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      user_id: userId,
      order_number: orderNumber,
      items: [{
        product_id: product._id,
        quantity: quantity,
        price: product.product_price
      }],
      total_amount: totals.total,
      shipping_address: {
        name: shipping_address.name || 'N/A',
        address: shipping_address.address || 'N/A',
        city: shipping_address.city || 'N/A',
        phone: shipping_address.phone || 'N/A'
      },
      status: 'pending'
    });

    const savedOrder = await order.save();

    await Product.findByIdAndUpdate(
      product_id,
      { $inc: { product_stock: -quantity } }
    );

    const orderProducts = [{
      name: product.product_name,
      brand: product.product_brand,
      price: product.product_price,
      quantity: quantity,
      total: itemsTotal
    }];

    try {
      const emailTemplate = orderConfirmationTemplate(user, savedOrder, orderProducts, shipping_address, totals);
      
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      // Email error silently handled
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
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};