const orderConfirmationTemplate = (user, order, orderProducts, shippingAddress) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate totals
  const subtotal = orderProducts.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal >= 99 ? 0 : 10; // Free shipping over $99
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  // Generate delivery estimate
  const deliveryStart = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const deliveryEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - InkDesk</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { font-size: 28px; margin-bottom: 10px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .order-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .order-info h2 { color: #667eea; margin-bottom: 15px; font-size: 20px; }
            .order-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .detail-item { padding: 10px; background-color: white; border-radius: 5px; border-left: 4px solid #667eea; }
            .detail-label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-value { font-size: 16px; color: #333; margin-top: 5px; }
            .products-section { margin: 30px 0; }
            .products-section h3 { color: #333; margin-bottom: 20px; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .product-item { display: flex; align-items: center; padding: 15px; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 15px; background-color: #fff; }
            .product-image { width: 60px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px; background-color: #f8f9fa; }
            .product-details { flex: 1; }
            .product-name { font-weight: bold; font-size: 16px; color: #333; margin-bottom: 5px; }
            .product-brand { color: #666; font-size: 14px; margin-bottom: 5px; }
            .product-price { color: #667eea; font-weight: bold; }
            .product-quantity { text-align: right; }
            .quantity-badge { background-color: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
            .price-summary { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0; }
            .price-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .price-row.total { border-top: 2px solid #667eea; padding-top: 15px; margin-top: 15px; font-weight: bold; font-size: 18px; color: #667eea; }
            .shipping-info { background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
            .shipping-info h4 { color: #17a2b8; margin-bottom: 15px; }
            .address { background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px; }
            .delivery-estimate { background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .footer { background-color: #343a40; color: white; padding: 30px 20px; text-align: center; }
            .footer-links { margin: 20px 0; }
            .footer-links a { color: #adb5bd; text-decoration: none; margin: 0 15px; }
            .footer-links a:hover { color: white; }
            .social-links { margin: 20px 0; }
            .social-links a { display: inline-block; margin: 0 10px; width: 35px; height: 35px; background-color: #667eea; border-radius: 50%; text-align: center; line-height: 35px; color: white; text-decoration: none; }
            @media (max-width: 600px) {
                .order-details { grid-template-columns: 1fr; }
                .product-item { flex-direction: column; text-align: center; }
                .product-image { margin: 0 0 10px 0; }
                .product-quantity { text-align: center; margin-top: 10px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p>Thank you for shopping with InkDesk</p>
            </div>

            <!-- Content -->
            <div class="content">
                <!-- Greeting -->
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Dear <strong>${user.name || user.first_name || 'Valued Customer'}</strong>,
                </p>
                <p style="margin-bottom: 30px;">
                    We're excited to confirm that your order has been successfully placed and is now being processed. 
                    Here are the details of your purchase:
                </p>

                <!-- Order Information -->
                <div class="order-info">
                    <h2>📋 Order Information</h2>
                    <div class="order-details">
                        <div class="detail-item">
                            <div class="detail-label">Order Number</div>
                            <div class="detail-value">${order.order_number}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Order Date</div>
                            <div class="detail-value">${formatDate(order.createdAt)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Order Status</div>
                            <div class="detail-value" style="color: #28a745; text-transform: capitalize;">
                                🟢 ${order.status}
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Total Amount</div>
                            <div class="detail-value" style="color: #667eea; font-weight: bold; font-size: 18px;">
                                ${formatPrice(order.total_amount)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products Section -->
                <div class="products-section">
                    <h3>📚 Your Order Items (${orderProducts.length} ${orderProducts.length === 1 ? 'item' : 'items'})</h3>
                    ${orderProducts.map(product => `
                        <div class="product-item">
                            <img src="${product.image ? (product.image.startsWith('http') ? product.image : `${process.env.FRONTEND_URL || 'http://localhost:5173'}${product.image}`) : 'https://placehold.co/60x80?text=No+Image'}" 
                                 alt="${product.name}" class="product-image" 
                                 onerror="this.src='https://placehold.co/60x80?text=No+Image'">
                            <div class="product-details">
                                <div class="product-name">${product.name}</div>
                                <div class="product-brand">by ${product.brand}</div>
                                <div class="product-price">${formatPrice(product.price)} each</div>
                            </div>
                            <div class="product-quantity">
                                <div class="quantity-badge">Qty: ${product.quantity}</div>
                                <div style="margin-top: 10px; font-weight: bold; color: #667eea;">
                                    ${formatPrice(product.total)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Price Summary -->
                <div class="price-summary">
                    <h3 style="margin-bottom: 20px; color: #333;">💰 Order Summary</h3>
                    <div class="price-row">
                        <span>Subtotal (${orderProducts.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                        <span>${formatPrice(subtotal)}</span>
                    </div>
                    <div class="price-row">
                        <span>Shipping:</span>
                        <span style="color: ${shipping === 0 ? '#28a745' : '#333'};">
                            ${shipping === 0 ? 'FREE ✨' : formatPrice(shipping)}
                        </span>
                    </div>
                    <div class="price-row">
                        <span>Tax (8%):</span>
                        <span>${formatPrice(tax)}</span>
                    </div>
                    <div class="price-row total">
                        <span>Total:</span>
                        <span>${formatPrice(finalTotal)}</span>
                    </div>
                </div>

                <!-- Shipping Information -->
                <div class="shipping-info">
                    <h4>🚚 Shipping Information</h4>
                    <div class="address">
                        <strong>${shippingAddress.name}</strong><br>
                        ${shippingAddress.address}<br>
                        ${shippingAddress.city}<br>
                        📞 ${shippingAddress.phone}
                    </div>
                </div>

                <!-- Delivery Estimate -->
                <div class="delivery-estimate">
                    <strong>📦 Estimated Delivery</strong><br>
                    Your order will arrive between <strong>${formatDate(deliveryStart)}</strong> and <strong>${formatDate(deliveryEnd)}</strong>
                    <br><small>We'll send you tracking information once your order ships.</small>
                </div>

                <!-- What's Next -->
                <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="color: #856404; margin-bottom: 15px;">🔔 What happens next?</h4>
                    <ul style="color: #856404; margin-left: 20px;">
                        <li style="margin-bottom: 8px;">We'll process your order within 24 hours</li>
                        <li style="margin-bottom: 8px;">You'll receive a shipping confirmation with tracking details</li>
                        <li style="margin-bottom: 8px;">Your order will be delivered in 5-7 business days</li>
                        <li>You can track your order status in your account dashboard</li>
                    </ul>
                </div>

                <!-- Contact Information -->
                <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <h4 style="margin-bottom: 15px; color: #333;">Need Help? 🤝</h4>
                    <p style="margin-bottom: 10px;">If you have any questions about your order, feel free to reach out:</p>
                    <p style="margin-bottom: 5px;">📧 <a href="mailto:support@inkdesk.com" style="color: #667eea;">support@inkdesk.com</a></p>
                    <p style="margin-bottom: 15px;">📞 +91 98765 43210</p>
                    <p><a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/account/orders" style="color: #667eea; text-decoration: none; font-weight: bold;">Track Your Order →</a></p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 18px; margin-bottom: 10px;">Thank you for choosing InkDesk! 📚</p>
                    <p style="color: #666;">We hope you love your new books!</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <h3 style="margin-bottom: 15px;">InkDesk</h3>
                <p style="margin-bottom: 20px;">Your favorite online bookstore</p>
                
                <div class="footer-links">
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/account">My Account</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact Us</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/help">Help Center</a>
                </div>

                <div class="social-links">
                    <a href="#" title="Facebook">📘</a>
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="LinkedIn">💼</a>
                </div>

                <p style="font-size: 12px; margin-top: 20px; opacity: 0.7;">
                    © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                    This email was sent to ${user.email}
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
    Dear ${user.name || user.first_name || 'Valued Customer'},

    Thank you for your order! Here are your order details:

    Order Number: ${order.order_number}
    Order Date: ${formatDate(order.createdAt)}
    Total Amount: ${formatPrice(order.total_amount)}

    Items Ordered:
    ${orderProducts.map(product => 
      `- ${product.name} by ${product.brand} (Qty: ${product.quantity}) - ${formatPrice(product.total)}`
    ).join('\n')}

    Shipping Address:
    ${shippingAddress.name}
    ${shippingAddress.address}
    ${shippingAddress.city}
    ${shippingAddress.phone}

    Estimated Delivery: ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}

    Thank you for shopping with InkDesk!

    Best regards,
    The InkDesk Team
  `;

  return {
    subject: `🎉 Order Confirmation - ${order.order_number} | InkDesk`,
    html,
    text
  };
};

// Add more email templates here in the future
const welcomeEmailTemplate = (user) => {
  // Future welcome email template
};

const passwordResetTemplate = (user, resetLink) => {
  // Future password reset template
};

module.exports = {
  orderConfirmationTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate
};