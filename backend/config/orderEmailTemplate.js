const orderConfirmationTemplate = (user, order, orderProducts, shippingAddress, totals) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const deliveryStart = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const deliveryEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const shippingMessage = totals.shipping === 0 ? 'FREE ✨' : formatPrice(totals.shipping);
  const totalItems = orderProducts.reduce((sum, item) => sum + item.quantity, 0);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - InkDesk</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Red Rose', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(220, 38, 38, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); padding: 50px 32px; text-align: center; position: relative; }
            .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
            .logo { color: #ffffff; font-size: 36px; font-weight: 700; margin-bottom: 12px; font-family: 'Red Rose', serif; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .tagline { color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 500; position: relative; z-index: 1; }
            .content { padding: 50px 32px; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); }
            .success-icon { 
                width: 80px; 
                height: 80px; 
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin: 0 auto 32px; 
                font-size: 40px; 
                color: white;
                box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
            }
            .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; text-align: center; }
            .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; text-align: center; }
            .order-info { 
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                border: 2px solid #dc2626; 
                border-radius: 16px; 
                padding: 32px; 
                margin: 40px 0; 
                position: relative;
            }
            .order-info::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                border-radius: 16px 16px 0 0;
            }
            .order-details { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .detail-item { padding: 20px; background-color: white; border-radius: 12px; border: 1px solid #fecaca; text-align: center; }
            .detail-label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            .detail-value { font-size: 16px; color: #dc2626; font-weight: 700; }
            .products-section { margin: 40px 0; }
            .products-section h3 { color: #dc2626; margin-bottom: 24px; font-size: 20px; border-bottom: 2px solid #dc2626; padding-bottom: 12px; font-family: 'Red Rose', serif; }
            .product-table { 
                background: white; 
                border-radius: 16px; 
                overflow: hidden; 
                border: 2px solid #fecaca; 
                margin-bottom: 20px;
            }
            .table-header { 
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                padding: 16px 20px; 
                display: grid; 
                grid-template-columns: 2fr 1fr 1fr 1fr; 
                gap: 20px; 
                font-weight: 600; 
                color: #dc2626; 
                font-size: 14px; 
                text-transform: uppercase; 
                letter-spacing: 0.5px;
            }
            .product-row { 
                padding: 20px; 
                display: grid; 
                grid-template-columns: 2fr 1fr 1fr 1fr; 
                gap: 20px; 
                align-items: center; 
                border-bottom: 1px solid #fecaca;
                transition: all 0.3s ease;
            }
            .product-row:last-child { border-bottom: none; }
            .product-row:hover { background: linear-gradient(135deg, #fefefe 0%, #fafafa 100%); }
            .product-info h4 { font-weight: 700; font-size: 16px; color: #1a1a1a; margin-bottom: 4px; font-family: 'Red Rose', serif; }
            .product-info p { color: #64748b; font-size: 14px; }
            .product-price { color: #dc2626; font-weight: 600; text-align: center; }
            .product-quantity { 
                text-align: center; 
            }
            .quantity-badge { 
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                color: white; 
                padding: 6px 12px; 
                border-radius: 20px; 
                font-size: 14px; 
                font-weight: 600;
                display: inline-block;
            }
            .product-total { color: #dc2626; font-weight: 700; text-align: right; font-size: 16px; }
            .table-footer { 
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                padding: 20px; 
                display: grid; 
                grid-template-columns: 2fr 2fr; 
                gap: 20px; 
                border-top: 2px solid #dc2626;
            }
            .footer-left { color: #dc2626; font-weight: 600; }
            .footer-right { color: #dc2626; font-weight: 700; text-align: right; font-size: 18px; }
            .price-summary { 
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                border: 2px solid #dc2626; 
                border-radius: 16px; 
                padding: 32px; 
                margin: 40px 0; 
                position: relative;
            }
            .price-summary::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                border-radius: 16px 16px 0 0;
            }
            .price-summary h3 { margin-bottom: 20px; color: #dc2626; font-family: 'Red Rose', serif; font-size: 20px; }
            .price-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; }
            .price-row.total { 
                border-top: 2px solid #dc2626; 
                padding-top: 16px; 
                margin-top: 16px; 
                font-weight: 700; 
                font-size: 20px; 
                color: #dc2626; 
            }
            .delivery-info { 
                background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%); 
                border: 2px solid #0288d1; 
                border-radius: 16px; 
                padding: 24px; 
                margin: 32px 0; 
                text-align: center;
            }
            .delivery-info h4 { color: #0288d1; margin-bottom: 16px; font-family: 'Red Rose', serif; font-size: 18px; }
            .address { background-color: white; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #81d4fa; }
            .delivery-estimate { 
                background: white; 
                border-radius: 12px; 
                padding: 16px; 
                margin-top: 16px; 
                border: 1px solid #81d4fa;
            }
            .delivery-estimate strong { color: #0288d1; font-size: 16px; }
            .processing-status {
                background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
                border: 2px solid #4caf50;
                border-radius: 16px;
                padding: 20px;
                margin: 32px 0;
                text-align: center;
            }
            .processing-status .status-icon {
                background: #4caf50;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
            }
            .processing-status p {
                color: #2e7d32;
                font-weight: 600;
                font-size: 14px;
            }
            .cta-buttons { text-align: center; margin: 40px 0; }
            .cta-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                color: #ffffff; 
                padding: 16px 32px; 
                border-radius: 50px; 
                text-decoration: none; 
                font-weight: 600; 
                font-size: 16px; 
                margin: 8px 12px; 
                font-family: 'Red Rose', serif; 
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
            }
            .cta-button:hover { 
                transform: translateY(-3px); 
                box-shadow: 0 12px 35px rgba(220, 38, 38, 0.45);
            }
            .cta-button.secondary {
                background: linear-gradient(135deg, #0288d1 0%, #0277bd 100%);
                box-shadow: 0 8px 25px rgba(2, 136, 209, 0.35);
            }
            .cta-button.secondary:hover {
                box-shadow: 0 12px 35px rgba(2, 136, 209, 0.45);
            }
            .footer { 
                background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%); 
                color: #fef2f2; 
                text-align: center; 
                padding: 40px 32px; 
                position: relative;
            }
            .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="footerGrain" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="20" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="20" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23footerGrain)"/></svg>'); opacity: 0.2; }
            .footer-logo { font-size: 28px; font-weight: 700; margin-bottom: 12px; font-family: 'Red Rose', serif; position: relative; z-index: 1; }
            .footer-text { font-size: 16px; color: #fecaca; margin-bottom: 20px; position: relative; z-index: 1; }
            .footer-links { display: flex; justify-content: center; gap: 30px; margin-bottom: 20px; position: relative; z-index: 1; }
            .footer-links a { 
                color: #fecaca; 
                text-decoration: none; 
                font-size: 16px; 
                font-weight: 500; 
                transition: all 0.3s ease;
                padding: 8px 12px;
                border-radius: 6px;
            }
            .footer-links a:hover { 
                color: #ffffff; 
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }
            .footer-bottom { font-size: 14px; color: #fca5a5; padding-top: 20px; border-top: 1px solid rgba(239, 68, 68, 0.3); position: relative; z-index: 1; }
            .support-info { 
                background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); 
                border-radius: 12px; 
                padding: 20px; 
                margin: 20px 0; 
                text-align: center; 
                border: 1px solid #d1d5db;
            }
            .support-info p { font-size: 14px; color: #6b7280; margin-bottom: 12px; }
            .support-contacts { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
            .support-contacts span { font-size: 12px; color: #6b7280; display: flex; align-items: center; }
            .support-contacts span::before { margin-right: 6px; }
            @media (max-width: 600px) {
                .container { margin: 20px; border-radius: 16px; }
                .header, .content { padding: 40px 24px; }
                .order-details { grid-template-columns: 1fr; }
                .table-header, .product-row, .table-footer { grid-template-columns: 1fr; gap: 12px; text-align: center; }
                .table-header { display: none; }
                .product-row { padding: 16px; border-bottom: 2px solid #fecaca; }
                .product-info { margin-bottom: 12px; }
                .table-footer { grid-template-columns: 1fr; text-align: center; }
                .footer-links { flex-direction: column; gap: 16px; }
                .greeting { font-size: 28px; }
                .support-contacts { flex-direction: column; gap: 12px; }
                .cta-buttons { margin: 32px 0; }
                .cta-button { display: block; margin: 12px 0; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">InkDesk</div>
                <div class="tagline">Premium Stationery & Office Supplies</div>
            </div>

            <div class="content">
                <div class="success-icon">✓</div>
                <div class="greeting">Order Placed Successfully!</div>
                <div class="message">
                    Dear <strong>${user.name || user.first_name || 'Valued Customer'}</strong>, thank you for your purchase. Your order is being processed.
                </div>

                <div class="order-info">
                    <div class="order-details">
                        <div class="detail-item">
                            <div class="detail-label">Order Number</div>
                            <div class="detail-value">${order.order_number}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Order Date</div>
                            <div class="detail-value">${formatDate(order.createdAt || new Date())}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Total Amount</div>
                            <div class="detail-value">${formatPrice(totals.total)}</div>
                        </div>
                    </div>
                </div>

                <div class="products-section">
                    <h3>📚 Order Items (${totalItems} ${totalItems === 1 ? 'item' : 'items'})</h3>
                    <div class="product-table">
                        <div class="table-header">
                            <div>Product</div>
                            <div>Price</div>
                            <div>Qty</div>
                            <div>Total</div>
                        </div>
                        ${orderProducts.map(product => `
                            <div class="product-row">
                                <div class="product-info">
                                    <h4>${product.name}</h4>
                                    <p>by ${product.brand}</p>
                                </div>
                                <div class="product-price">${formatPrice(product.price)}</div>
                                <div class="product-quantity">
                                    <span class="quantity-badge">${product.quantity}</span>
                                </div>
                                <div class="product-total">${formatPrice(product.total)}</div>
                            </div>
                        `).join('')}
                        <div class="table-footer">
                            <div class="footer-left">Total Items: ${totalItems}</div>
                            <div class="footer-right">Items Subtotal: ${formatPrice(totals.subtotal)}</div>
                        </div>
                    </div>
                </div>

                <div class="price-summary">
                    <h3>💰 Order Summary</h3>
                    <div class="price-row">
                        <span>Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''}):</span>
                        <span>${formatPrice(totals.subtotal)}</span>
                    </div>
                    <div class="price-row">
                        <span>Shipping:</span>
                        <span style="color: ${totals.shipping === 0 ? '#dc2626' : '#1a1a1a'}; font-weight: ${totals.shipping === 0 ? '700' : '500'};">
                            ${shippingMessage}
                        </span>
                    </div>
                    <div class="price-row">
                        <span>GST (18%):</span>
                        <span>${formatPrice(totals.tax)}</span>
                    </div>
                    <div class="price-row total">
                        <span>Total:</span>
                        <span>${formatPrice(totals.total)}</span>
                    </div>
                </div>

                <div class="delivery-info">
                    <h4>🚚 Delivery Information</h4>
                    <div class="address">
                        <strong>${shippingAddress.name}</strong><br>
                        ${shippingAddress.address}<br>
                        ${shippingAddress.city}, ${shippingAddress.state}<br>
                        📞 ${shippingAddress.phone}
                    </div>
                    <div class="delivery-estimate">
                        <strong>📦 Estimated Delivery</strong><br>
                        ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}
                    </div>
                </div>

                <div class="processing-status">
                    <div class="status-icon">📦</div>
                    <p>Your order is being processed and will be shipped soon</p>
                </div>

                <div class="cta-buttons">
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/orders" class="cta-button secondary">Track Your Order</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop" class="cta-button">Continue Shopping</a>
                </div>
            </div>

            <div class="footer">
                <div class="footer-logo">InkDesk</div>
                <div class="footer-text">Your trusted partner for quality stationery</div>
                
                <div class="support-info">
                    <p>Thank you for shopping with InkDesk!</p>
                    <div class="support-contacts">
                        <span>📧 support@inkdesk.com</span>
                        <span>📞 +91 98765 43210</span>
                    </div>
                </div>

                <div class="footer-links">
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
                    <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/help">Help</a>
                </div>
                <div class="footer-bottom">
                    © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                    This email was sent to ${user.email}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
Order Placed Successfully!

Dear ${user.name || user.first_name || 'Customer'},

Thank you for your purchase! Your order is being processed.

Order Details:
- Order Number: ${order.order_number}  
- Order Date: ${formatDate(order.createdAt || new Date())}
- Total Amount: ${formatPrice(totals.total)}

Order Summary:
- Subtotal: ${formatPrice(totals.subtotal)}
- Shipping: ${totals.shipping === 0 ? 'Free shipping' : formatPrice(totals.shipping)}
- GST (18%): ${formatPrice(totals.tax)}
- Total: ${formatPrice(totals.total)}

Items Ordered (${totalItems} items):
${orderProducts.map(product => `- ${product.name} by ${product.brand} (Qty: ${product.quantity}) - ${formatPrice(product.total)}`).join('\n')}

Delivery Address:
${shippingAddress.name}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state}
Phone: ${shippingAddress.phone}

Estimated Delivery: ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}

Your order is being processed and will be shipped soon.

Thank you for shopping with InkDesk!

Contact us: support@inkdesk.com | +91 98765 43210

Best regards,
The InkDesk Team
  `;

  return {
    subject: `🎉 Order Confirmation - ${order.order_number}`,
    html,
    text
  };
};

module.exports = {
  orderConfirmationTemplate
};