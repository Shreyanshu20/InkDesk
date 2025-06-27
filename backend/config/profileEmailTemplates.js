module.exports.profileEmailTemplates = {

    // Profile Update Success Email Template
    profileUpdateSuccess: (user, updatedFields) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Updated Successfully</title>
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
              .update-card { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 2px solid #dc2626; 
                  border-radius: 16px; 
                  padding: 32px; 
                  margin: 40px 0; 
                  text-align: left;
                  position: relative;
              }
              .update-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                  border-radius: 16px 16px 0 0;
              }
              .update-title { font-size: 20px; color: #dc2626; font-weight: 600; margin-bottom: 16px; text-align: center; }
              .update-list { list-style: none; padding: 0; margin: 0; }
              .update-list li { font-size: 16px; color: #64748b; margin-bottom: 12px; padding-left: 24px; position: relative; }
              .update-list li::before { content: '✓'; position: absolute; left: 0; top: 0; color: #dc2626; font-weight: bold; }
              .update-time { font-size: 14px; color: #64748b; text-align: center; margin-top: 16px; font-weight: 500; }
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
                  <div class="success-icon">👤</div>
                  <div class="greeting">Profile Updated!</div>
                  <div class="message">
                      Hello ${user.first_name}! Your InkDesk profile has been successfully updated with the latest information.
                  </div>

                  <div class="update-card">
                      <div class="update-title">📝 Updated Information</div>
                      <ul class="update-list">
                          ${updatedFields.map(field => `<li>${field}</li>`).join('')}
                      </ul>
                      <div class="update-time">
                          Updated on ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                      </div>
                  </div>

                  <a href="${process.env.FRONTEND_URL}/profile" class="cta-button">
                      View Profile
                  </a>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-text">Your trusted partner for quality stationery</div>
                  <div class="footer-links">
                      <a href="${process.env.FRONTEND_URL}/shop">Shop</a>
                      <a href="${process.env.FRONTEND_URL}/about">About</a>
                      <a href="${process.env.FRONTEND_URL}/contact">Contact</a>
                      <a href="${process.env.FRONTEND_URL}/help">Help</a>
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
      Profile Updated Successfully!

      Hello ${user.first_name},

      Your InkDesk profile has been successfully updated.

      Updated Information:
      ${updatedFields.map(field => `- ${field}`).join('\n')}

      Updated on ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}

      View your profile: ${process.env.FRONTEND_URL}/profile

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '👤 Profile Updated Successfully - InkDesk',
            html,
            text
        };
    },

    // Password Change Success Email Template  
    passwordChangeSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed Successfully</title>
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
              .change-time { font-size: 16px; color: #64748b; font-weight: 400; }
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
                  <div class="greeting">Password Changed!</div>
                  <div class="message">
                      Hello ${user.first_name}! Your InkDesk account password has been successfully changed and your account is secure.
                  </div>

                  <div class="success-card">
                      <div class="success-text">
                          ✅ Your password has been updated successfully
                      </div>
                      <div class="change-time">
                          Changed on ${new Date().toLocaleDateString('en-IN', {
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
                          <li>Log out from shared or public devices</li>
                          <li>Review your account activity regularly</li>
                      </ul>
                  </div>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-text">Your trusted partner for quality stationery</div>
                  <div class="footer-links">
                      <a href="${process.env.FRONTEND_URL}/shop">Shop</a>
                      <a href="${process.env.FRONTEND_URL}/about">About</a>
                      <a href="${process.env.FRONTEND_URL}/contact">Contact</a>
                      <a href="${process.env.FRONTEND_URL}/help">Help</a>
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
      Password Changed Successfully!

      Hello ${user.first_name},

      Your InkDesk account password has been successfully changed and your account is secure.

      Changed on ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}

      Security Tips:
      - Use a strong, unique password for your InkDesk account
      - Don't share your password with anyone
      - Log out from shared or public devices
      - Review your account activity regularly

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '🔐 Password Changed Successfully - InkDesk',
            html,
            text
        };
    }
};