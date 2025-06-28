module.exports.orderConfirmationTemplate = (user, order, orderProducts, shippingAddress, totals) => {
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
    const totalItems = orderProducts.reduce((sum, item) => sum + item.quantity, 0);

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - InkDesk</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #dc2626; padding: 30px 20px; text-align: center; color: white; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .tagline { font-size: 14px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 15px; text-align: center; }
            .message { font-size: 16px; margin-bottom: 25px; text-align: center; color: #666; }
            .order-info { background: #f8f9fa; border: 1px solid #dc2626; border-radius: 8px; padding: 20px; margin: 25px 0; }
            .order-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 15px; }
            .detail-item { text-align: center; padding: 10px; background: white; border-radius: 5px; }
            .detail-label { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 5px; }
            .detail-value { font-size: 16px; font-weight: bold; color: #dc2626; }
            .products-section { margin: 25px 0; }
            .products-section h3 { color: #dc2626; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #dc2626; padding-bottom: 8px; }
            .product-item { background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center; }
            .product-info h4 { margin: 0; font-size: 16px; color: #333; }
            .product-info p { margin: 5px 0 0 0; font-size: 14px; color: #666; }
            .product-details { display: flex; gap: 20px; align-items: center; }
            .price-summary { background: #f8f9fa; border: 1px solid #dc2626; border-radius: 8px; padding: 20px; margin: 25px 0; }
            .price-summary h3 { margin: 0 0 15px 0; color: #dc2626; font-size: 18px; }
            .price-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .price-row.total { border-top: 2px solid #dc2626; padding-top: 10px; margin-top: 10px; font-weight: bold; font-size: 18px; color: #dc2626; }
            .delivery-info { background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 25px 0; }
            .delivery-info h4 { color: #1976d2; margin: 0 0 15px 0; font-size: 16px; }
            .address { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .cta-buttons { text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: #dc2626; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 5px 10px; }
            .cta-button.secondary { background: #2196f3; }
            .footer { background: #333; color: #ccc; text-align: center; padding: 20px; }
            .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .footer-links { margin: 15px 0; }
            .footer-links a { color: #ccc; text-decoration: none; margin: 0 10px; }
            .footer-bottom { font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #555; }
            @media (max-width: 600px) {
                .container { margin: 10px; }
                .content { padding: 20px 15px; }
                .order-details { grid-template-columns: 1fr; }
                .product-item { flex-direction: column; align-items: flex-start; }
                .product-details { width: 100%; justify-content: space-between; margin-top: 10px; }
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
                <div class="greeting">Order Confirmation</div>
                <div class="message">
                    Hello <strong>${user.name || user.first_name || 'Customer'}</strong>, thank you for your order. We're processing it now.
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
                    <h3>Your Order (${totalItems} items)</h3>
                    ${orderProducts.map(product => `
                        <div class="product-item">
                            <div class="product-info">
                                <h4>${product.name}</h4>
                                <p>by ${product.brand}</p>
                            </div>
                            <div class="product-details">
                                <span>${formatPrice(product.price)}</span>
                                <span>Qty: ${product.quantity}</span>
                                <strong>${formatPrice(product.total)}</strong>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="price-summary">
                    <h3>Order Summary</h3>
                    <div class="price-row">
                        <span>Subtotal:</span>
                        <span>${formatPrice(totals.subtotal)}</span>
                    </div>
                    <div class="price-row">
                        <span>Shipping:</span>
                        <span>${totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</span>
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
                    <h4>Delivery Information</h4>
                    <div class="address">
                        <strong>${shippingAddress.name}</strong><br>
                        ${shippingAddress.address}<br>
                        ${shippingAddress.city}, ${shippingAddress.state}<br>
                        Phone: ${shippingAddress.phone}
                    </div>
                    <p><strong>Estimated Delivery:</strong> ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}</p>
                </div>

                <div class="cta-buttons">
                    <a href="${process.env.FRONTEND_URL}/orders" class="cta-button secondary">Track Order</a>
                    <a href="${process.env.FRONTEND_URL}/shop" class="cta-button">Shop Again</a>
                </div>
            </div>

            <div class="footer">
                <div class="footer-logo">InkDesk</div>
                <div class="footer-links">
                    <a href="${process.env.FRONTEND_URL}/shop">Shop</a>
                    <a href="${process.env.FRONTEND_URL}/contact">Contact</a>
                    <a href="${process.env.FRONTEND_URL}/help">Help</a>
                </div>
                <div class="footer-bottom">
                    © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                    Questions? Email us at support@inkdesk.com
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

    const text = `
Order Confirmation - InkDesk

Hello ${user.name || user.first_name || 'Customer'},

Thank you for your order! Here are the details:

Order Number: ${order.order_number}
Order Date: ${formatDate(order.createdAt || new Date())}
Total Amount: ${formatPrice(totals.total)}

Items Ordered:
${orderProducts.map(product => `- ${product.name} by ${product.brand} (Qty: ${product.quantity}) - ${formatPrice(product.total)}`).join('\n')}

Order Summary:
- Subtotal: ${formatPrice(totals.subtotal)}
- Shipping: ${totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
- GST (18%): ${formatPrice(totals.tax)}
- Total: ${formatPrice(totals.total)}

Delivery Address:
${shippingAddress.name}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state}
Phone: ${shippingAddress.phone}

Estimated Delivery: ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}

Track your order: ${process.env.FRONTEND_URL}/orders

Thank you for shopping with InkDesk!
Support: support@inkdesk.com
  `;

    return {
        subject: `Order Confirmation - ${order.order_number}`,
        html,
        text
    };
};
