module.exports.profileEmailTemplates = {

    profileUpdateSuccess: (user, updatedFields) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Updated Successfully</title>
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
              .update-card { 
                  background: #f0fdf4; 
                  border: 2px solid #22c55e; 
                  border-radius: 8px; 
                  padding: 24px; 
                  margin: 30px 0; 
                  text-align: left; 
              }
              .update-title { font-size: 18px; color: #15803d; font-weight: 600; margin-bottom: 16px; text-align: center; }
              .update-list { list-style: none; padding: 0; margin: 0; }
              .update-list li { font-size: 14px; color: #15803d; margin-bottom: 8px; padding-left: 20px; position: relative; }
              .update-list li::before { content: '✓'; position: absolute; left: 0; font-weight: bold; }
              .update-time { font-size: 12px; color: #666; text-align: center; margin-top: 16px; }
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

                  <a href="${process.env.ORIGIN_URL || 'http://localhost:5173'}/profile" class="cta-button">
                      View Profile
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

      View your profile: ${process.env.ORIGIN_URL || 'http://localhost:5173'}/profile

      Best regards,
      The InkDesk Team
    `;

        return {
            subject: '👤 Profile Updated Successfully - InkDesk',
            html,
            text
        };
    },

    passwordChangeSuccess: (user) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed Successfully</title>
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
              .change-time { font-size: 14px; color: #666; }
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
                  <div class="greeting">Password Changed!</div>
                  <div class="message">
                      Hello ${user.first_name}! Your InkDesk account password has been successfully changed and your account is secure.
                  </div>

                  <div class="success-card">
                      <div class="success-text">✅ Your password has been updated successfully</div>
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