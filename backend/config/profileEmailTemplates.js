const profileChangeEmailTemplate = (user, changeType, details = {}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  let subject, html, text;
  const timestamp = formatDate(new Date());

  switch (changeType) {
    case 'profile':
      subject = '✅ Profile Updated Successfully - InkDesk';
      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Profile Updated - InkDesk</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { font-size: 24px; margin-bottom: 10px; }
                .content { padding: 30px 20px; }
                .change-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
                .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
                .detail-label { font-weight: bold; color: #555; }
                .detail-value { color: #333; }
                .security-notice { background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
                .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
                .btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Profile Updated</h1>
                    <p>Your account information has been successfully updated</p>
                </div>
                
                <div class="content">
                    <p>Hello <strong>${user.first_name || 'User'}</strong>,</p>
                    <p>Your profile information has been successfully updated on <strong>${timestamp}</strong>.</p>
                    
                    <div class="change-details">
                        <h3 style="color: #28a745; margin-bottom: 15px;">📝 Updated Information</h3>
                        ${details.first_name ? `<div class="detail-row"><span class="detail-label">First Name:</span><span class="detail-value">${details.first_name}</span></div>` : ''}
                        ${details.last_name ? `<div class="detail-row"><span class="detail-label">Last Name:</span><span class="detail-value">${details.last_name}</span></div>` : ''}
                        ${details.phone ? `<div class="detail-row"><span class="detail-label">Phone Number:</span><span class="detail-value">${details.phone}</span></div>` : ''}
                        <div class="detail-row"><span class="detail-label">Email Address:</span><span class="detail-value">${user.email} (unchanged)</span></div>
                    </div>
                    
                    <div class="security-notice">
                        <h4 style="color: #856404; margin-bottom: 10px;">🔒 Security Notice</h4>
                        <p style="color: #856404;">If you didn't make these changes, please contact our support team immediately.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/settings" class="btn">View Profile Settings</a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>InkDesk</strong> - Your trusted online bookstore</p>
                    <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">This email was sent to ${user.email}</p>
                </div>
            </div>
        </body>
        </html>
      `;
      text = `Profile Updated - InkDesk\n\nHello ${user.first_name || 'User'},\n\nYour profile has been updated on ${timestamp}.\n\nUpdated Information:\n${details.first_name ? `- First Name: ${details.first_name}\n` : ''}${details.last_name ? `- Last Name: ${details.last_name}\n` : ''}${details.phone ? `- Phone: ${details.phone}\n` : ''}\nIf you didn't make these changes, contact support immediately.\n\nBest regards,\nInkDesk Team`;
      break;

    case 'address':
      subject = '🏠 Address Updated Successfully - InkDesk';
      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Address Updated - InkDesk</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { font-size: 24px; margin-bottom: 10px; }
                .content { padding: 30px 20px; }
                .address-box { background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
                .security-notice { background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
                .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
                .btn { display: inline-block; padding: 12px 24px; background-color: #17a2b8; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏠 Address Updated</h1>
                    <p>Your shipping address has been successfully updated</p>
                </div>
                
                <div class="content">
                    <p>Hello <strong>${user.first_name || 'User'}</strong>,</p>
                    <p>Your shipping address has been successfully updated on <strong>${timestamp}</strong>.</p>
                    
                    <div class="address-box">
                        <h3 style="color: #17a2b8; margin-bottom: 15px;">📍 Updated Address</h3>
                        <div style="background-color: white; padding: 15px; border-radius: 5px;">
                            ${details.address_line1}<br>
                            ${details.address_line2 ? `${details.address_line2}<br>` : ''}
                            ${details.city}${details.state ? `, ${details.state}` : ''}<br>
                            ${details.postal_code}<br>
                            <strong>${details.country}</strong>
                        </div>
                    </div>
                    
                    <div class="security-notice">
                        <h4 style="color: #856404; margin-bottom: 10px;">🔒 Security Notice</h4>
                        <p style="color: #856404;">This address will be used for all future orders. If you didn't make this change, please contact support immediately.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/settings" class="btn">Manage Address</a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>InkDesk</strong> - Your trusted online bookstore</p>
                    <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">This email was sent to ${user.email}</p>
                </div>
            </div>
        </body>
        </html>
      `;
      text = `Address Updated - InkDesk\n\nHello ${user.first_name || 'User'},\n\nYour address has been updated on ${timestamp}.\n\nUpdated Address:\n${details.address_line1}\n${details.address_line2 ? `${details.address_line2}\n` : ''}${details.city}${details.state ? `, ${details.state}` : ''}\n${details.postal_code}\n${details.country}\n\nIf you didn't make this change, contact support immediately.\n\nBest regards,\nInkDesk Team`;
      break;

    case 'password':
      subject = '🔐 Password Changed Successfully - InkDesk';
      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed - InkDesk</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { font-size: 24px; margin-bottom: 10px; }
                .content { padding: 30px 20px; }
                .security-alert { background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
                .security-tips { background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
                .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
                .btn { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Changed</h1>
                    <p>Your account password has been successfully updated</p>
                </div>
                
                <div class="content">
                    <p>Hello <strong>${user.first_name || 'User'}</strong>,</p>
                    <p>Your account password was successfully changed on <strong>${timestamp}</strong>.</p>
                    
                    <div class="security-alert">
                        <h3 style="color: #721c24; margin-bottom: 15px;">🚨 Important Security Notice</h3>
                        <ul style="color: #721c24; margin-left: 20px;">
                            <li style="margin-bottom: 8px;"><strong>If this was you:</strong> Your account is now more secure with your new password.</li>
                            <li style="margin-bottom: 8px;"><strong>If this wasn't you:</strong> Someone may have unauthorized access to your account. Please contact support immediately.</li>
                            <li>All active sessions have been logged out for security.</li>
                        </ul>
                    </div>
                    
                    <div class="security-tips">
                        <h4 style="color: #0c5460; margin-bottom: 10px;">💡 Security Tips</h4>
                        <ul style="color: #0c5460; margin-left: 20px; font-size: 14px;">
                            <li>Never share your password with anyone</li>
                            <li>Use a unique password for your InkDesk account</li>
                            <li>Consider enabling two-factor authentication</li>
                            <li>Log out from shared devices</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/login" class="btn">Login with New Password</a>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                        <p><strong>Need Help?</strong></p>
                        <p style="margin: 10px 0;">If you didn't make this change or need assistance:</p>
                        <p>📧 <a href="mailto:support@inkdesk.com" style="color: #dc3545;">support@inkdesk.com</a></p>
                        <p>📞 +91 98765 43210</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>InkDesk</strong> - Your trusted online bookstore</p>
                    <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">This email was sent to ${user.email}</p>
                </div>
            </div>
        </body>
        </html>
      `;
      text = `Password Changed - InkDesk\n\nHello ${user.first_name || 'User'},\n\nYour password was changed on ${timestamp}.\n\nIMPORTANT:\n- If this was you: Your account is now more secure\n- If this wasn't you: Contact support immediately\n\nSecurity Tips:\n- Never share your password\n- Use unique passwords\n- Log out from shared devices\n\nNeed help? Email: support@inkdesk.com\n\nBest regards,\nInkDesk Team`;
      break;

    case 'account_deleted':
      subject = '👋 Account Deleted Successfully - InkDesk';
      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Deleted - InkDesk</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { font-size: 24px; margin-bottom: 10px; }
                .content { padding: 30px 20px; }
                .farewell-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d; }
                .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👋 Account Deleted</h1>
                    <p>Your InkDesk account has been permanently deleted</p>
                </div>
                
                <div class="content">
                    <p>Hello <strong>${user.first_name || 'User'}</strong>,</p>
                    <p>Your InkDesk account has been permanently deleted on <strong>${timestamp}</strong> as requested.</p>
                    
                    <div class="farewell-box">
                        <h3 style="color: #495057; margin-bottom: 15px;">📚 Thank You</h3>
                        <p>We're sorry to see you go! Thank you for being part of the InkDesk community.</p>
                        <p style="margin-top: 15px;"><strong>What's been deleted:</strong></p>
                        <ul style="margin-left: 20px; margin-top: 10px;">
                            <li>Your account and profile information</li>
                            <li>Your order history and preferences</li>
                            <li>Your saved addresses and payment methods</li>
                            <li>Your wishlist and cart items</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
                        <h4 style="color: #0c5460; margin-bottom: 10px;">💫 Come Back Anytime</h4>
                        <p style="color: #0c5460;">If you ever want to return, you can create a new account anytime. We'd love to welcome you back to our community of book lovers!</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #6c757d; font-style: italic;">"A reader lives a thousand lives before he dies... The man who never reads lives only one." - George R.R. Martin</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>InkDesk</strong> - Your trusted online bookstore</p>
                    <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">This was sent to ${user.email}</p>
                </div>
            </div>
        </body>
        </html>
      `;
      text = `Account Deleted - InkDesk\n\nHello ${user.first_name || 'User'},\n\nYour account was deleted on ${timestamp}.\n\nThank you for being part of InkDesk. We're sorry to see you go!\n\nWhat's been deleted:\n- Your account and profile\n- Order history\n- Saved addresses\n- Wishlist and cart\n\nYou can create a new account anytime if you want to return.\n\nBest regards,\nInkDesk Team`;
      break;
  }

  return { subject, html, text };
};

module.exports = {
  profileChangeEmailTemplate
};