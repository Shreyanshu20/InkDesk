module.exports.authEmailTemplates = {

    // Registration Welcome Email (after verification)
    registrationWelcome: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to InkDesk</title>
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
              .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; }
              .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; }
              .offer-card { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 2px solid #dc2626; 
                  border-radius: 16px; 
                  padding: 32px; 
                  margin: 40px 0; 
                  text-align: center; 
                  position: relative;
                  overflow: hidden;
              }
              .offer-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
              }
              .offer-title { font-size: 24px; font-weight: 700; color: #dc2626; margin-bottom: 12px; font-family: 'Red Rose', serif; }
              .offer-code { 
                  font-size: 28px; 
                  font-weight: 700; 
                  color: #ffffff; 
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                  padding: 16px 24px; 
                  border-radius: 12px; 
                  display: inline-block; 
                  margin: 12px 0; 
                  font-family: 'Red Rose', serif; 
                  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
                  letter-spacing: 2px;
              }
              .offer-terms { font-size: 14px; color: #64748b; margin-top: 12px; }
              .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                  color: #ffffff; 
                  padding: 18px 36px; 
                  border-radius: 50px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  font-size: 18px; 
                  margin: 32px 8px 8px 8px; 
                  transition: all 0.3s ease; 
                  font-family: 'Red Rose', serif; 
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
              }
              .cta-button:hover { 
                  transform: translateY(-3px); 
                  box-shadow: 0 12px 35px rgba(220, 38, 38, 0.45);
              }
              .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
              .feature { 
                  text-align: center; 
                  padding: 24px; 
                  background: #fafafa; 
                  border: 1px solid #e5e7eb; 
                  border-radius: 12px; 
                  transition: all 0.3s ease;
                  position: relative;
              }
              .feature:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.1);
                  border-color: #dc2626;
              }
              .feature::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 3px;
                  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
                  border-radius: 12px 12px 0 0;
                  opacity: 0;
                  transition: opacity 0.3s ease;
              }
              .feature:hover::before {
                  opacity: 1;
              }
              .feature-icon { font-size: 28px; margin-bottom: 12px; }
              .feature-text { font-size: 16px; color: #374151; font-weight: 600; }
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
              @media (max-width: 600px) {
                  .container { margin: 20px; border-radius: 16px; }
                  .header, .content { padding: 40px 24px; }
                  .features { grid-template-columns: 1fr; }
                  .footer-links { flex-direction: column; gap: 16px; }
                  .greeting { font-size: 28px; }
                  .offer-code { font-size: 24px; }
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
                      Your InkDesk account is now active and ready. Discover premium stationery and office supplies with fast delivery across India.
                  </div>

                  <div class="offer-card">
                      <div class="offer-title">🎉 Special Welcome Offer</div>
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
                  <div class="footer-text">Your trusted partner for quality stationery</div>
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
      Welcome to InkDesk!

      Hello ${user.first_name || 'User'},

      Your InkDesk account is now active. Discover premium stationery and office supplies with fast delivery.

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

    // OTP Verification Email Template
    verificationOtp: (user, otp) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Red Rose', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
              .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(220, 38, 38, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05); }
              .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); padding: 50px 32px; text-align: center; position: relative; }
              .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
              .logo { color: #ffffff; font-size: 36px; font-weight: 700; margin-bottom: 12px; font-family: 'Red Rose', serif; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .tagline { color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 500; position: relative; z-index: 1; }
              .content { padding: 50px 32px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); }
              .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; }
              .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; }
              .otp-container { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 3px dashed #dc2626; 
                  border-radius: 16px; 
                  padding: 40px; 
                  margin: 40px 0; 
                  position: relative;
              }
              .otp-container::before {
                  content: '';
                  position: absolute;
                  top: -3px;
                  left: -3px;
                  right: -3px;
                  bottom: -3px;
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                  border-radius: 19px;
                  z-index: -1;
                  opacity: 0.1;
              }
              .otp-label { font-size: 16px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
              .otp-code { 
                  font-size: 48px; 
                  font-weight: 700; 
                  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); 
                  -webkit-background-clip: text; 
                  -webkit-text-fill-color: transparent; 
                  background-clip: text;
                  letter-spacing: 8px; 
                  margin: 20px 0; 
                  font-family: 'Red Rose', serif; 
              }
              .otp-note { font-size: 16px; color: #64748b; margin-top: 20px; }
              .warning { 
                  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
                  border: 2px solid #f59e0b; 
                  border-radius: 12px; 
                  padding: 20px; 
                  margin: 32px 0; 
              }
              .warning-text { font-size: 16px; color: #92400e; font-weight: 500; }
              .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                  color: #ffffff; 
                  padding: 18px 36px; 
                  border-radius: 50px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  font-size: 18px; 
                  margin-top: 32px; 
                  font-family: 'Red Rose', serif; 
                  transition: all 0.3s ease;
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
              }
              .cta-button:hover { 
                  transform: translateY(-3px); 
                  box-shadow: 0 12px 35px rgba(220, 38, 38, 0.45);
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
              @media (max-width: 600px) {
                  .container { margin: 20px; border-radius: 16px; }
                  .header, .content { padding: 40px 24px; }
                  .otp-code { font-size: 36px; letter-spacing: 4px; }
                  .footer-links { flex-direction: column; gap: 16px; }
                  .greeting { font-size: 28px; }
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
                  <div class="greeting">🔐 Verify Your Account</div>
                  <div class="message">
                      Hello ${user.first_name || 'User'}, please use the verification code below to complete your InkDesk account setup.
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
                  <div class="footer-text">Your trusted partner for quality stationery</div>
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

    // Password Reset Email Template
    forgotPassword: (user, otp) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Red Rose', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
              .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(220, 38, 38, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05); }
              .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); padding: 50px 32px; text-align: center; position: relative; }
              .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
              .logo { color: #ffffff; font-size: 36px; font-weight: 700; margin-bottom: 12px; font-family: 'Red Rose', serif; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .tagline { color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 500; position: relative; z-index: 1; }
              .content { padding: 50px 32px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); }
              .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; }
              .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; }
              .otp-container { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 3px dashed #dc2626; 
                  border-radius: 16px; 
                  padding: 40px; 
                  margin: 40px 0; 
                  position: relative;
              }
              .otp-container::before {
                  content: '';
                  position: absolute;
                  top: -3px;
                  left: -3px;
                  right: -3px;
                  bottom: -3px;
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                  border-radius: 19px;
                  z-index: -1;
                  opacity: 0.1;
              }
              .otp-label { font-size: 16px; color: #64748b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
              .otp-code { 
                  font-size: 48px; 
                  font-weight: 700; 
                  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); 
                  -webkit-background-clip: text; 
                  -webkit-text-fill-color: transparent; 
                  background-clip: text;
                  letter-spacing: 8px; 
                  margin: 20px 0; 
                  font-family: 'Red Rose', serif; 
              }
              .otp-note { font-size: 16px; color: #64748b; margin-top: 20px; }
              .security-warning { 
                  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); 
                  border: 2px solid #ef4444; 
                  border-radius: 12px; 
                  padding: 20px; 
                  margin: 32px 0; 
              }
              .security-text { font-size: 16px; color: #b91c1c; font-weight: 500; }
              .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                  color: #ffffff; 
                  padding: 18px 36px; 
                  border-radius: 50px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  font-size: 18px; 
                  margin-top: 32px; 
                  font-family: 'Red Rose', serif; 
                  transition: all 0.3s ease;
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
              }
              .cta-button:hover { 
                  transform: translateY(-3px); 
                  box-shadow: 0 12px 35px rgba(220, 38, 38, 0.45);
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
              @media (max-width: 600px) {
                  .container { margin: 20px; border-radius: 16px; }
                  .header, .content { padding: 40px 24px; }
                  .footer-links { flex-direction: column; gap: 16px; }
                  .greeting { font-size: 28px; }
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
                  <div class="footer-text">Your trusted partner for quality stationery</div>
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

    // Account Verification Success Email
    verificationSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified Successfully</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Red Rose', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
              .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(220, 38, 38, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05); }
              .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); padding: 50px 32px; text-align: center; position: relative; }
              .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
              .logo { color: #ffffff; font-size: 36px; font-weight: 700; margin-bottom: 12px; font-family: 'Red Rose', serif; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .tagline { color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 500; position: relative; z-index: 1; }
              .content { padding: 50px 32px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); }
              .success-icon { font-size: 80px; margin-bottom: 32px; animation: bounce 2s infinite; }
              @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-10px); }
                  60% { transform: translateY(-5px); }
              }
              .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; }
              .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; }
              .success-card { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 2px solid #dc2626; 
                  border-radius: 16px; 
                  padding: 32px; 
                  margin: 40px 0; 
                  position: relative;
              }
              .success-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                  border-radius: 16px 16px 0 0;
              }
              .success-text { font-size: 18px; color: #dc2626; font-weight: 500; }
              .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                  color: #ffffff; 
                  padding: 18px 36px; 
                  border-radius: 50px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  font-size: 18px; 
                  margin-top: 32px; 
                  font-family: 'Red Rose', serif; 
                  transition: all 0.3s ease;
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
              }
              .cta-button:hover { 
                  transform: translateY(-3px); 
                  box-shadow: 0 12px 35px rgba(220, 38, 38, 0.45);
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
              @media (max-width: 600px) {
                  .container { margin: 20px; border-radius: 16px; }
                  .header, .content { padding: 40px 24px; }
                  .footer-links { flex-direction: column; gap: 16px; }
                  .greeting { font-size: 28px; }
                  .success-icon { font-size: 64px; }
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
                  <div class="footer-text">Your trusted partner for quality stationery</div>
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

    // Password Reset Success Email Template
    passwordResetSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Red Rose', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
              .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(220, 38, 38, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05); }
              .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); padding: 50px 32px; text-align: center; position: relative; }
              .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
              .logo { color: #ffffff; font-size: 36px; font-weight: 700; margin-bottom: 12px; font-family: 'Red Rose', serif; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .tagline { color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 500; position: relative; z-index: 1; }
              .content { padding: 50px 32px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%); }
              .success-icon { font-size: 80px; margin-bottom: 32px; animation: bounce 2s infinite; }
              @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-10px); }
                  60% { transform: translateY(-5px); }
              }
              .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; }
              .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; }
              .success-card { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 2px solid #dc2626; 
                  border-radius: 16px; 
                  padding: 32px; 
                  margin: 40px 0; 
                  position: relative;
              }
              .success-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                  border-radius: 16px 16px 0 0;
              }
              .success-text { font-size: 18px; color: #dc2626; font-weight: 500; margin-bottom: 16px; }
              .reset-time { font-size: 16px; color: #64748b; font-weight: 400; }
              .security-tips { 
                  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); 
                  border: 2px solid #ef4444; 
                  border-radius: 12px; 
                  padding: 24px; 
                  margin: 32px 0; 
                  text-align: left;
              }
              .security-title { font-size: 18px; color: #b91c1c; font-weight: 600; margin-bottom: 12px; text-align: center; }
              .security-list { list-style: none; padding: 0; margin: 0; }
              .security-list li { font-size: 16px; color: #b91c1c; margin-bottom: 8px; padding-left: 24px; position: relative; }
              .security-list li::before { content: '🔒'; position: absolute; left: 0; top: 0; }
              .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
                  color: #ffffff; 
                  padding: 18px 36px; 
                  border-radius: 50px; 
                  text-decoration: none; 
                  font-weight: 600; 
                  font-size: 18px; 
                  margin-top: 32px; 
                  font-family: 'Red Rose', serif; 
                  transition: all 0.3s ease;
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.35);
              }
              .cta-button:hover { 
                  transform: translateY(-3px); 
                  box-shadow: 0 12px 35px rgba(220, 38, 38, 0.45);
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
              @media (max-width: 600px) {
                  .container { margin: 20px; border-radius: 16px; }
                  .header, .content { padding: 40px 24px; }
                  .footer-links { flex-direction: column; gap: 16px; }
                  .greeting { font-size: 28px; }
                  .success-icon { font-size: 64px; }
                  .security-tips { padding: 20px; }
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
                  <div class="success-icon">🔐</div>
                  <div class="greeting">Password Reset Successful!</div>
                  <div class="message">
                      Hello ${user.first_name || 'User'}, your InkDesk account password has been successfully changed and your account is now secure.
                  </div>

                  <div class="success-card">
                      <div class="success-text">
                          ✅ Your password has been updated successfully
                      </div>
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
                  <div class="footer-text">Your trusted partner for quality stationery</div>
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