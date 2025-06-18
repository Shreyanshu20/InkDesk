const authEmailTemplates = {

    // Registration Welcome Email (after verification)
    registrationWelcome: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to InkDesk!</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 20px; text-align: center; }
              .header h1 { font-size: 32px; margin-bottom: 10px; }
              .header p { font-size: 18px; opacity: 0.9; }
              .content { padding: 30px 20px; }
              .welcome-message { background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border-left: 4px solid #28a745; }
              .cta-section { background-color: #667eea; color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; }
              .btn { display: inline-block; padding: 15px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 8px; margin: 10px; font-weight: bold; }
              .btn-white { background-color: white; color: #667eea; }
              .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
              .footer-links { margin: 15px 0; }
              .footer-links a { color: #adb5bd; text-decoration: none; margin: 0 10px; }
              .footer-links a:hover { color: white; }
              .social-links { margin: 15px 0; }
              .social-links a { display: inline-block; margin: 0 5px; width: 35px; height: 35px; background-color: #667eea; border-radius: 50%; text-align: center; line-height: 35px; color: white; text-decoration: none; }
              @media (max-width: 600px) {
                  .header h1 { font-size: 24px; }
                  .content { padding: 20px 15px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Header -->
              <div class="header">
                  <h1>🎉 Welcome to InkDesk!</h1>
                  <p>Your account is now ready</p>
              </div>

              <!-- Content -->
              <div class="content">
                  <!-- Welcome Message -->
                  <div class="welcome-message">
                      <h2 style="color: #28a745; margin-bottom: 20px;">Hello ${user.first_name || 'User'}! 👋</h2>
                      <p style="font-size: 18px; margin-bottom: 20px;">
                          Welcome to InkDesk - your one-stop destination for quality stationery and office supplies!
                      </p>
                      <p style="font-size: 16px; color: #155724;">
                          Your account has been successfully verified and you're all set to start shopping.
                      </p>
                  </div>

                  <!-- Exclusive Offer -->
                  <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; border-left: 4px solid #ff9800;">
                      <h3 style="color: #e65100; margin-bottom: 15px;">🎁 Special Welcome Offer!</h3>
                      <p style="font-size: 18px; color: #bf360c; font-weight: bold; margin-bottom: 10px;">
                          Get <strong>20% OFF</strong> on your first order! Use code: <strong>WELCOME20</strong>
                      </p>
                      <p style="font-size: 12px; color: #636e72;">*Valid for 30 days. Minimum order ₹99 for free shipping. Cannot be combined with other offers.</p>
                  </div>

                  <!-- What We Offer -->
                  <div style="margin: 30px 0;">
                      <h3 style="text-align: center; margin-bottom: 20px; color: #333;">📝 What We Offer</h3>
                      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
                              <div>
                                  <p style="font-size: 18px; margin-bottom: 5px;">✏️</p>
                                  <p style="font-size: 14px; color: #666;">Writing Supplies</p>
                              </div>
                              <div>
                                  <p style="font-size: 18px; margin-bottom: 5px;">📓</p>
                                  <p style="font-size: 14px; color: #666;">Notebooks & Paper</p>
                              </div>
                              <div>
                                  <p style="font-size: 18px; margin-bottom: 5px;">🏢</p>
                                  <p style="font-size: 14px; color: #666;">Office Supplies</p>
                              </div>
                              <div>
                                  <p style="font-size: 18px; margin-bottom: 5px;">🎒</p>
                                  <p style="font-size: 14px; color: #666;">School Essentials</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Call to Action -->
                  <div class="cta-section">
                      <h3 style="margin-bottom: 20px;">🛍️ Ready to Start Shopping?</h3>
                      <p style="margin-bottom: 25px; opacity: 0.9;">
                          Discover quality stationery at great prices with free shipping on orders over ₹99!
                      </p>
                      <div>
                          <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop" class="btn btn-white">
                              Start Shopping
                          </a>
                          <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/categories" class="btn btn-white">
                              Browse Categories
                          </a>
                      </div>
                  </div>

                  <!-- Benefits -->
                  <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #28a745;">
                      <h4 style="color: #155724; margin-bottom: 15px; text-align: center;">✨ Why Choose InkDesk?</h4>
                      <ul style="color: #155724; margin-left: 20px;">
                          <li style="margin-bottom: 8px;">🚚 Free shipping on orders above ₹99</li>
                          <li style="margin-bottom: 8px;">💰 Best prices guaranteed</li>
                          <li style="margin-bottom: 8px;">⚡ Fast delivery across India</li>
                          <li style="margin-bottom: 8px;">🔄 Easy returns & exchanges</li>
                          <li>🎯 Quality products from trusted brands</li>
                      </ul>
                  </div>

                  <!-- Support Information -->
                  <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                      <h4 style="margin-bottom: 15px; color: #333;">💬 Need Help?</h4>
                      <p style="margin-bottom: 15px;">Our friendly team is here to help!</p>
                      <p style="margin-bottom: 5px;">📧 <a href="mailto:support@inkdesk.com" style="color: #667eea;">support@inkdesk.com</a></p>
                      <p style="margin-bottom: 15px;">📞 +91 98765 43210</p>
                      <p style="font-size: 12px; color: #666;">Available Monday-Sunday, 9 AM - 9 PM IST</p>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                      <p style="font-size: 18px; margin-bottom: 10px; color: #28a745;">Happy Shopping! 🛒✨</p>
                      <p style="color: #666;">We're here to make your stationery shopping experience amazing!</p>
                  </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                  <h3 style="margin-bottom: 15px;">InkDesk</h3>
                  <p style="margin-bottom: 15px;">Your trusted stationery & office supplies store</p>
                  
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About Us</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/help">Help</a>
                  </div>

                  <div class="social-links">
                      <a href="#" title="Facebook">📘</a>
                      <a href="#" title="Twitter">🐦</a>
                      <a href="#" title="Instagram">📷</a>
                      <a href="#" title="LinkedIn">💼</a>
                  </div>

                  <p style="font-size: 12px; margin-top: 15px; opacity: 0.7;">
                      © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                      This email was sent to ${user.email}
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

        const text = `
      Welcome to InkDesk!

      Hello ${user.first_name || 'User'},

      Welcome to InkDesk - your one-stop destination for quality stationery and office supplies!

      Your account has been successfully verified and you're all set to start shopping.

      🎁 SPECIAL WELCOME OFFER!
      Get 20% OFF on your first order! Use code: WELCOME20
      *Valid for 30 days. Minimum order ₹99 for free shipping.

      What we offer:
      ✏️ Writing Supplies
      📓 Notebooks & Paper  
      🏢 Office Supplies
      🎒 School Essentials

      Why choose InkDesk?
      🚚 Free shipping on orders above ₹99
      💰 Best prices guaranteed
      ⚡ Fast delivery across India
      🔄 Easy returns & exchanges
      🎯 Quality products from trusted brands

      Start Shopping: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop
      Browse Categories: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/categories

      Need help? Contact support@inkdesk.com or call +91 98765 43210

      Happy Shopping!
      The InkDesk Team
    `;

        return {
            subject: '🎉 Welcome to InkDesk - Your Stationery Store!',
            html,
            text
        };
    },

    // OTP Verification Email Template (for resend OTP)
    verificationOtp: (user, otp) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account - InkDesk</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { font-size: 28px; margin-bottom: 10px; }
              .header p { font-size: 16px; opacity: 0.9; }
              .content { padding: 30px 20px; }
              .verification-box { background-color: #f8f9fa; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border-left: 4px solid #667eea; }
              .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 20px 0; padding: 15px; background-color: #e8f2ff; border-radius: 8px; border: 2px dashed #667eea; }
              .timer-notice { background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
              .security-notice { background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
              .btn { display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
              .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
              .footer-links { margin: 15px 0; }
              .footer-links a { color: #adb5bd; text-decoration: none; margin: 0 10px; }
              .footer-links a:hover { color: white; }
              .social-links { margin: 15px 0; }
              .social-links a { display: inline-block; margin: 0 5px; width: 35px; height: 35px; background-color: #667eea; border-radius: 50%; text-align: center; line-height: 35px; color: white; text-decoration: none; }
              @media (max-width: 600px) {
                  .otp-code { font-size: 28px; letter-spacing: 4px; }
                  .header h1 { font-size: 24px; }
                  .content { padding: 20px 15px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Header -->
              <div class="header">
                  <h1>🔐 Verify Your Account</h1>
                  <p>Please verify your email address to complete registration</p>
              </div>

              <!-- Content -->
              <div class="content">
                  <p style="font-size: 16px; margin-bottom: 20px;">
                      Hello <strong>${user.first_name || 'User'}</strong>,
                  </p>
                  <p style="margin-bottom: 30px;">
                      Thank you for registering with InkDesk! To complete your account setup and start exploring our vast collection of stationery and office supplies, please verify your email address using the OTP below:
                  </p>

                  <!-- OTP Verification Box -->
                  <div class="verification-box">
                      <h3 style="color: #667eea; margin-bottom: 20px;">📧 Your Verification Code</h3>
                      <div class="otp-code">${otp}</div>
                      <p style="color: #666; font-size: 14px; margin-top: 15px;">
                          Enter this 6-digit code in the verification page to activate your account
                      </p>
                  </div>

                  <!-- Timer Notice -->
                  <div class="timer-notice">
                      <h4 style="color: #856404; margin-bottom: 10px;">⏰ Time Sensitive</h4>
                      <p style="color: #856404; margin: 0;">This OTP will expire in <strong>10 minutes</strong>. If you don't verify within this time, you'll need to request a new code.</p>
                  </div>

                  <!-- Security Notice -->
                  <div class="security-notice">
                      <h4 style="color: #0c5460; margin-bottom: 15px;">🔒 Security Tips</h4>
                      <ul style="color: #0c5460; margin-left: 20px; font-size: 14px;">
                          <li style="margin-bottom: 5px;">Never share this OTP with anyone</li>
                          <li style="margin-bottom: 5px;">InkDesk will never ask for your OTP via phone or email</li>
                          <li style="margin-bottom: 5px;">If you didn't request this verification, please ignore this email</li>
                          <li>Complete verification from the same device where you registered</li>
                      </ul>
                  </div>

                  <!-- Call to Action -->
                  <div style="text-align: center; margin: 30px 0;">
                      <p style="margin-bottom: 15px;">Ready to start shopping for office supplies?</p>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(user.email)}" class="btn">
                          Complete Verification →
                      </a>
                  </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                  <h3 style="margin-bottom: 15px;">InkDesk</h3>
                  <p style="margin-bottom: 15px;">Your trusted stationery & office supplies store</p>
                  
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About Us</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/help">Help</a>
                  </div>

                  <div class="social-links">
                      <a href="#" title="Facebook">📘</a>
                      <a href="#" title="Twitter">🐦</a>
                      <a href="#" title="Instagram">📷</a>
                      <a href="#" title="LinkedIn">💼</a>
                  </div>

                  <p style="font-size: 12px; margin-top: 15px; opacity: 0.7;">
                      © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                      This email was sent to ${user.email}
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

        const text = `
      Hello ${user.first_name || 'User'},

      Thank you for registering with InkDesk!

      Your verification OTP: ${otp}

      This OTP is valid for 10 minutes. Please verify your account to start exploring our stationery and office supplies collection.

      Security Tips:
      - Never share this OTP with anyone
      - Complete verification from the same device
      - If you didn't request this, please ignore this email

      Visit: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(user.email)}

      Need help? Contact support@inkdesk.com

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '🔐 Verify Your Account - InkDesk',
            html,
            text
        };
    },



    // Updated Forgot Password Email Template
    forgotPassword: (user, otp) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - InkDesk</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { font-size: 28px; margin-bottom: 10px; }
              .header p { font-size: 16px; opacity: 0.9; }
              .content { padding: 30px 20px; }
              .reset-box { background-color: #fff5f5; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border-left: 4px solid #dc3545; }
              .otp-code { font-size: 36px; font-weight: bold; color: #dc3545; letter-spacing: 8px; margin: 20px 0; padding: 15px; background-color: #ffe6e6; border-radius: 8px; border: 2px dashed #dc3545; }
              .security-alert { background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
              .timer-notice { background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
              .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
              .footer-links { margin: 15px 0; }
              .footer-links a { color: #adb5bd; text-decoration: none; margin: 0 10px; }
              .footer-links a:hover { color: white; }
              .btn { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
              .social-links { margin: 15px 0; }
              .social-links a { display: inline-block; margin: 0 5px; width: 35px; height: 35px; background-color: #667eea; border-radius: 50%; text-align: center; line-height: 35px; color: white; text-decoration: none; }
              @media (max-width: 600px) {
                  .otp-code { font-size: 28px; letter-spacing: 4px; }
                  .header h1 { font-size: 24px; }
                  .content { padding: 20px 15px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Header -->
              <div class="header">
                  <h1>🔑 Password Reset Request</h1>
                  <p>Secure password reset for your InkDesk account</p>
              </div>

              <!-- Content -->
              <div class="content">
                  <p style="font-size: 16px; margin-bottom: 20px;">
                      Hello <strong>${user.first_name || 'User'}</strong>,
                  </p>
                  <p style="margin-bottom: 30px;">
                      We received a request to reset your InkDesk account password. If you made this request, please use the OTP below to reset your password. If you didn't request this, please ignore this email.
                  </p>

                  <!-- Reset Password Box -->
                  <div class="reset-box">
                      <h3 style="color: #dc3545; margin-bottom: 20px;">🔐 Password Reset Code</h3>
                      <div class="otp-code">${otp}</div>
                      <p style="color: #666; font-size: 14px; margin-top: 15px;">
                          Enter this 6-digit code on the password reset page to continue
                      </p>
                  </div>

                  <!-- Security Alert -->
                  <div class="security-alert">
                      <h4 style="color: #721c24; margin-bottom: 15px;">🚨 Security Alert</h4>
                      <ul style="color: #721c24; margin-left: 20px; font-size: 14px;">
                          <li style="margin-bottom: 8px;"><strong>If this was you:</strong> Continue with the password reset process using the OTP above</li>
                          <li style="margin-bottom: 8px;"><strong>If this wasn't you:</strong> Someone may have tried to access your account</li>
                          <li style="margin-bottom: 8px;"><strong>Never share this OTP</strong> with anyone - InkDesk will never ask for it</li>
                      </ul>
                  </div>

                  <!-- Timer Notice -->
                  <div class="timer-notice">
                      <h4 style="color: #856404; margin-bottom: 10px;">⏰ Time Sensitive</h4>
                      <p style="color: #856404; margin: 0;">This password reset OTP will expire in <strong>10 minutes</strong>. If you don't reset your password within this time, you'll need to request a new reset code.</p>
                  </div>

                  <!-- Call to Action -->
                  <div style="text-align: center; margin: 30px 0;">
                      <p style="margin-bottom: 15px;">Ready to reset your password?</p>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(user.email)}" class="btn">
                          Reset Password Now →
                      </a>
                  </div>

                  <!-- Help Section -->
                  <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                      <h4 style="margin-bottom: 15px; color: #333;">Need Help? 🤝</h4>
                      <p style="margin-bottom: 10px;">Having trouble resetting your password?</p>
                      <p style="margin-bottom: 5px;">📧 <a href="mailto:support@inkdesk.com" style="color: #667eea;">support@inkdesk.com</a></p>
                      <p style="margin-bottom: 15px;">📞 +91 98765 43210</p>
                      <p style="font-size: 12px; color: #666;">Our security team is available 24/7 to assist you</p>
                  </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                  <h3 style="margin-bottom: 15px;">InkDesk</h3>
                  <p style="margin-bottom: 15px;">Your trusted stationery & office supplies store</p>
                  
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About Us</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/help">Help</a>
                  </div>

                  <div class="social-links">
                      <a href="#" title="Facebook">📘</a>
                      <a href="#" title="Twitter">🐦</a>
                      <a href="#" title="Instagram">📷</a>
                      <a href="#" title="LinkedIn">💼</a>
                  </div>

                  <p style="font-size: 12px; margin-top: 15px; opacity: 0.7;">
                      © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                      This email was sent to ${user.email}
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

        const text = `
      Password Reset Request - InkDesk

      Hello ${user.first_name || 'User'},

      We received a request to reset your InkDesk account password.

      Your password reset OTP: ${otp}

      This OTP is valid for 10 minutes.

      Reset your password: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(user.email)}

      SECURITY ALERT:
      - If this was you: Continue with the reset process
      - If this wasn't you: Someone may have tried to access your account
      - Never share this OTP with anyone

      Didn't request this? Simply ignore this email.

      Need help? Contact support@inkdesk.com or call +91 98765 43210

      Best regards,
      The InkDesk Security Team
    `;

        return {
            subject: '🔑 Reset Your InkDesk Password - Secure Code Inside',
            html,
            text
        };
    },

    // Account Verification Success Email
    verificationSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified Successfully - InkDesk</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { font-size: 28px; margin-bottom: 10px; }
              .header p { font-size: 16px; opacity: 0.9; }
              .content { padding: 30px 20px; }
              .success-box { background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border-left: 4px solid #28a745; }
              .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
              .btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>✅ Account Verified!</h1>
                  <p>Your InkDesk account is now fully activated</p>
              </div>

              <div class="content">
                  <div class="success-box">
                      <h2 style="color: #28a745; margin-bottom: 20px;">🎉 Congratulations ${user.first_name || 'User'}!</h2>
                      <p style="font-size: 18px; margin-bottom: 20px;">
                          Your email address has been successfully verified and your InkDesk account is now fully activated!
                      </p>
                      <p style="font-size: 16px; color: #155724;">
                          You now have complete access to all InkDesk features and can start exploring our vast collection of stationery and office supplies.
                      </p>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop" class="btn">
                          🛍️ Start Shopping Now
                      </a>
                  </div>
              </div>

              <div class="footer">
                  <p><strong>InkDesk</strong> - Your trusted stationery & office supplies store</p>
                  <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">This email was sent to ${user.email}</p>
              </div>
          </div>
      </body>
      </html>
    `;

        const text = `
      Account Verified Successfully!

      Hello ${user.first_name || 'User'},

      Congratulations! Your InkDesk account has been successfully verified and is now fully activated.

      You now have complete access to:
      - Browse our complete stationery catalog
      - Member discounts and offers
      - Order tracking and history
      - Priority customer support

      Start shopping: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop

      Welcome to InkDesk!
      The InkDesk Team
    `;

        return {
            subject: '✅ Account Verified Successfully - Welcome to InkDesk!',
            html,
            text
        };
    }
};

module.exports = { authEmailTemplates };