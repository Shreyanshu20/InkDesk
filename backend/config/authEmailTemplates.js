module.exports.authEmailTemplates = {

    registrationWelcome: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to InkDesk</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #dc2626; padding: 40px 20px; text-align: center; color: white; }
              .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
              .tagline { font-size: 14px; opacity: 0.9; }
              .content { padding: 40px 30px; }
              .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 16px; }
              .message { font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
              .offer-card { 
                  background: #fef2f2; 
                  border: 2px solid #dc2626; 
                  border-radius: 8px; 
                  padding: 24px; 
                  text-align: center; 
                  margin: 30px 0; 
              }
              .offer-title { font-size: 18px; font-weight: bold; color: #dc2626; margin-bottom: 12px; }
              .offer-code { 
                  font-size: 24px; 
                  font-weight: bold; 
                  background: #dc2626; 
                  color: white; 
                  padding: 12px 20px; 
                  border-radius: 6px; 
                  display: inline-block; 
                  margin: 12px 0; 
              }
              .offer-terms { font-size: 14px; color: #666; }
              .features { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 30px 0; }
              .feature { text-align: center; padding: 16px; background: #f9f9f9; border-radius: 6px; }
              .feature-icon { font-size: 20px; margin-bottom: 8px; }
              .feature-text { font-size: 14px; font-weight: 600; }
              .cta-button { 
                  display: inline-block; 
                  background: #dc2626; 
                  color: white; 
                  padding: 14px 28px; 
                  border-radius: 6px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  margin: 20px 0; 
              }
              .footer { background: #333; color: #ccc; text-align: center; padding: 30px 20px; }
              .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
              .footer-links { margin: 20px 0; }
              .footer-links a { color: #ccc; text-decoration: none; margin: 0 12px; }
              .footer-bottom { font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #555; }
              @media (max-width: 600px) {
                  .container { margin: 10px; }
                  .content { padding: 30px 20px; }
                  .features { grid-template-columns: 1fr; }
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
                  <div class="greeting">Welcome, ${user.first_name || 'User'}!</div>
                  <div class="message">
                      Thank you for joining InkDesk! Your account is now active and ready to use. 
                      Start exploring our premium collection of stationery and office supplies.
                  </div>

                  <div class="offer-card">
                      <div class="offer-title">🎉 Welcome Offer</div>
                      <div class="offer-code">WELCOME20</div>
                      <div class="offer-terms">20% off your first order • Valid for 30 days • Min. order ₹99</div>
                  </div>

                  <div class="features">
                      <div class="feature">
                          <div class="feature-icon">📝</div>
                          <div class="feature-text">Premium Writing</div>
                      </div>
                      <div class="feature">
                          <div class="feature-icon">🏢</div>
                          <div class="feature-text">Office Essentials</div>
                      </div>
                      <div class="feature">
                          <div class="feature-icon">🚚</div>
                          <div class="feature-text">Free Shipping</div>
                      </div>
                      <div class="feature">
                          <div class="feature-icon">⚡</div>
                          <div class="feature-text">Fast Delivery</div>
                      </div>
                  </div>

                  <div style="text-align: center;">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop" class="cta-button">Start Shopping</a>
                  </div>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
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
      Welcome to InkDesk!

      Hello ${user.first_name || 'User'},

      Thank you for joining InkDesk! Your account is now active and ready to use.

      WELCOME OFFER: Use code WELCOME20 for 20% off your first order (Valid 30 days, Min. ₹99)

      Start Shopping: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: 'Welcome to InkDesk - Your Account is Ready 🎉',
            html,
            text
        };
    },

    verificationOtp: (user, otp) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #dc2626; padding: 40px 20px; text-align: center; color: white; }
              .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
              .tagline { font-size: 14px; opacity: 0.9; }
              .content { padding: 40px 30px; text-align: center; }
              .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 16px; }
              .message { font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
              .otp-container { 
                  background: #fef2f2; 
                  border: 2px dashed #dc2626; 
                  border-radius: 8px; 
                  padding: 30px; 
                  margin: 30px 0; 
              }
              .otp-label { font-size: 14px; color: #666; margin-bottom: 12px; text-transform: uppercase; font-weight: 600; }
              .otp-code { 
                  font-size: 36px; 
                  font-weight: bold; 
                  color: #dc2626; 
                  letter-spacing: 4px; 
                  margin: 16px 0; 
              }
              .otp-note { font-size: 14px; color: #666; }
              .warning { 
                  background: #fef3c7; 
                  border: 1px solid #f59e0b; 
                  border-radius: 6px; 
                  padding: 16px; 
                  margin: 20px 0; 
              }
              .warning-text { font-size: 14px; color: #92400e; }
              .cta-button { 
                  display: inline-block; 
                  background: #dc2626; 
                  color: white; 
                  padding: 14px 28px; 
                  border-radius: 6px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  margin: 20px 0; 
              }
              .footer { background: #333; color: #ccc; text-align: center; padding: 30px 20px; }
              .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
              .footer-links { margin: 20px 0; }
              .footer-links a { color: #ccc; text-decoration: none; margin: 0 12px; }
              .footer-bottom { font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #555; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">InkDesk</div>
                  <div class="tagline">Premium Stationery & Office Supplies</div>
              </div>

              <div class="content">
                  <div class="greeting">🔐 Verify Your Account</div>
                  <div class="message">
                      Hello ${user.first_name || 'User'}, please use the verification code below to complete your account setup.
                  </div>

                  <div class="otp-container">
                      <div class="otp-label">Verification Code</div>
                      <div class="otp-code">${otp}</div>
                      <div class="otp-note">Enter this code to verify your email address</div>
                  </div>

                  <div class="warning">
                      <div class="warning-text">⏱️ This code expires in 10 minutes. Never share this code with anyone.</div>
                  </div>

                  <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(user.email)}" class="cta-button">
                      Verify Account
                  </a>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
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
      Verify Your InkDesk Account

      Hello ${user.first_name || 'User'},

      Your verification code: ${otp}

      This code expires in 10 minutes. Complete verification: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(user.email)}

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '🔐 Verify Your InkDesk Account',
            html,
            text
        };
    },

    forgotPassword: (user, otp) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #dc2626; padding: 40px 20px; text-align: center; color: white; }
              .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
              .tagline { font-size: 14px; opacity: 0.9; }
              .content { padding: 40px 30px; text-align: center; }
              .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 16px; }
              .message { font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
              .otp-container { 
                  background: #fef2f2; 
                  border: 2px dashed #dc2626; 
                  border-radius: 8px; 
                  padding: 30px; 
                  margin: 30px 0; 
              }
              .otp-label { font-size: 14px; color: #666; margin-bottom: 12px; text-transform: uppercase; font-weight: 600; }
              .otp-code { 
                  font-size: 36px; 
                  font-weight: bold; 
                  color: #dc2626; 
                  letter-spacing: 4px; 
                  margin: 16px 0; 
              }
              .otp-note { font-size: 14px; color: #666; }
              .security-warning { 
                  background: #fee2e2; 
                  border: 1px solid #ef4444; 
                  border-radius: 6px; 
                  padding: 16px; 
                  margin: 20px 0; 
              }
              .security-text { font-size: 14px; color: #b91c1c; }
              .cta-button { 
                  display: inline-block; 
                  background: #dc2626; 
                  color: white; 
                  padding: 14px 28px; 
                  border-radius: 6px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  margin: 20px 0; 
              }
              .footer { background: #333; color: #ccc; text-align: center; padding: 30px 20px; }
              .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
              .footer-links { margin: 20px 0; }
              .footer-links a { color: #ccc; text-decoration: none; margin: 0 12px; }
              .footer-bottom { font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #555; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">InkDesk</div>
                  <div class="tagline">Premium Stationery & Office Supplies</div>
              </div>

              <div class="content">
                  <div class="greeting">🔑 Reset Your Password</div>
                  <div class="message">
                      Hello ${user.first_name || 'User'}, we received a request to reset your password. Use the code below to continue.
                  </div>

                  <div class="otp-container">
                      <div class="otp-label">Reset Code</div>
                      <div class="otp-code">${otp}</div>
                      <div class="otp-note">Enter this code to reset your password</div>
                  </div>

                  <div class="security-warning">
                      <div class="security-text">🔒 This code expires in 10 minutes. If you didn't request this, please ignore this email.</div>
                  </div>

                  <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(user.email)}" class="cta-button">
                      Reset Password
                  </a>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
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
      Reset Your InkDesk Password

      Hello ${user.first_name || 'User'},

      Your password reset code: ${otp}

      This code expires in 10 minutes. Reset password: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(user.email)}

      If you didn't request this, please ignore this email.

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '🔑 Reset Your InkDesk Password',
            html,
            text
        };
    },

    verificationSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified Successfully</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #dc2626; padding: 40px 20px; text-align: center; color: white; }
              .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
              .tagline { font-size: 14px; opacity: 0.9; }
              .content { padding: 40px 30px; text-align: center; }
              .success-icon { font-size: 60px; margin-bottom: 20px; }
              .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 16px; }
              .message { font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
              .success-card { 
                  background: #f0fdf4; 
                  border: 2px solid #22c55e; 
                  border-radius: 8px; 
                  padding: 24px; 
                  margin: 30px 0; 
              }
              .success-text { font-size: 16px; color: #15803d; font-weight: 500; }
              .cta-button { 
                  display: inline-block; 
                  background: #dc2626; 
                  color: white; 
                  padding: 14px 28px; 
                  border-radius: 6px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  margin: 20px 0; 
              }
              .footer { background: #333; color: #ccc; text-align: center; padding: 30px 20px; }
              .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
              .footer-links { margin: 20px 0; }
              .footer-links a { color: #ccc; text-decoration: none; margin: 0 12px; }
              .footer-bottom { font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #555; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">InkDesk</div>
                  <div class="tagline">Premium Stationery & Office Supplies</div>
              </div>

              <div class="content">
                  <div class="success-icon">🎉</div>
                  <div class="greeting">Account Verified!</div>
                  <div class="message">
                      Congratulations ${user.first_name || 'User'}! Your InkDesk account has been successfully verified and is now fully active.
                  </div>

                  <div class="success-card">
                      <div class="success-text">
                          ✨ You now have complete access to all InkDesk features and can start exploring our premium stationery collection.
                      </div>
                  </div>

                  <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop" class="cta-button">
                      Start Shopping
                  </a>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
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
      Account Verified Successfully!

      Hello ${user.first_name || 'User'},

      Congratulations! Your InkDesk account has been successfully verified and is now fully active.

      Start shopping: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop

      Welcome to InkDesk!
      The InkDesk Team
    `;

        return {
            subject: '🎉 Account Verified Successfully - Welcome to InkDesk',
            html,
            text
        };
    },

    passwordResetSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #dc2626; padding: 40px 20px; text-align: center; color: white; }
              .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
              .tagline { font-size: 14px; opacity: 0.9; }
              .content { padding: 40px 30px; text-align: center; }
              .success-icon { font-size: 60px; margin-bottom: 20px; }
              .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 16px; }
              .message { font-size: 16px; margin-bottom: 30px; line-height: 1.5; }
              .success-card { 
                  background: #f0fdf4; 
                  border: 2px solid #22c55e; 
                  border-radius: 8px; 
                  padding: 24px; 
                  margin: 30px 0; 
              }
              .success-text { font-size: 16px; color: #15803d; font-weight: 500; margin-bottom: 12px; }
              .reset-time { font-size: 14px; color: #666; }
              .security-tips { 
                  background: #fef3c7; 
                  border: 1px solid #f59e0b; 
                  border-radius: 6px; 
                  padding: 20px; 
                  margin: 20px 0; 
                  text-align: left; 
              }
              .security-title { font-size: 16px; color: #92400e; font-weight: 600; margin-bottom: 12px; text-align: center; }
              .security-list { list-style: none; padding: 0; margin: 0; }
              .security-list li { font-size: 14px; color: #92400e; margin-bottom: 8px; padding-left: 20px; position: relative; }
              .security-list li::before { content: '•'; position: absolute; left: 0; font-weight: bold; }
              .cta-button { 
                  display: inline-block; 
                  background: #dc2626; 
                  color: white; 
                  padding: 14px 28px; 
                  border-radius: 6px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  margin: 20px 0; 
              }
              .footer { background: #333; color: #ccc; text-align: center; padding: 30px 20px; }
              .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
              .footer-links { margin: 20px 0; }
              .footer-links a { color: #ccc; text-decoration: none; margin: 0 12px; }
              .footer-bottom { font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #555; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">InkDesk</div>
                  <div class="tagline">Premium Stationery & Office Supplies</div>
              </div>

              <div class="content">
                  <div class="success-icon">🔐</div>
                  <div class="greeting">Password Reset Successful!</div>
                  <div class="message">
                      Hello ${user.first_name || 'User'}, your InkDesk account password has been successfully changed and your account is now secure.
                  </div>

                  <div class="success-card">
                      <div class="success-text">✅ Your password has been updated successfully</div>
                      <div class="reset-time">
                          Reset completed on ${new Date().toLocaleDateString('en-IN', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                          })}
                      </div>
                  </div>

                  <div class="security-tips">
                      <div class="security-title">🛡️ Security Tips</div>
                      <ul class="security-list">
                          <li>Use a strong, unique password for your InkDesk account</li>
                          <li>Don't share your password with anyone</li>
                          <li>Enable two-factor authentication for extra security</li>
                          <li>Log out from shared or public devices</li>
                      </ul>
                  </div>

                  <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/login" class="cta-button">
                      Login to Your Account
                  </a>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-links">
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/shop">Shop</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/about">About</a>
                      <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/contact">Contact</a>
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
      Password Reset Successful!

      Hello ${user.first_name || 'User'},

      Your InkDesk account password has been successfully changed and your account is now secure.

      Reset completed on ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      })}

      Security Tips:
      - Use a strong, unique password for your InkDesk account
      - Don't share your password with anyone
      - Enable two-factor authentication for extra security
      - Log out from shared or public devices

      Login to your account: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/login

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '🔐 Password Reset Successful - InkDesk',
            html,
            text
        };
    }
};