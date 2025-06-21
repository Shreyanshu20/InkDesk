module.exports.contactEmailTemplates = {

    // Contact Form Submission Email Template (for Admin)
    contactConfirmation: (contactData) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
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
              .alert-icon { font-size: 80px; margin-bottom: 32px; animation: pulse 2s infinite; }
              @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
              }
              .greeting { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 20px; font-family: 'Red Rose', serif; }
              .message { font-size: 18px; color: #64748b; margin-bottom: 40px; line-height: 1.8; }
              .contact-card { 
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                  border: 2px solid #dc2626; 
                  border-radius: 16px; 
                  padding: 32px; 
                  margin: 40px 0; 
                  text-align: left;
                  position: relative;
              }
              .contact-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
                  border-radius: 16px 16px 0 0;
              }
              .contact-title { font-size: 20px; color: #dc2626; font-weight: 600; margin-bottom: 16px; text-align: center; }
              .contact-details { margin-bottom: 20px; }
              .contact-row { display: flex; margin-bottom: 12px; }
              .contact-label { font-weight: 600; color: #dc2626; min-width: 100px; }
              .contact-value { color: #374151; flex: 1; font-weight: 500; }
              .message-text { 
                  background: #f9fafb; 
                  border-left: 4px solid #dc2626; 
                  padding: 20px; 
                  border-radius: 0 8px 8px 0; 
                  margin-top: 16px; 
                  color: #374151; 
                  font-size: 16px;
                  line-height: 1.6;
              }
              .action-info { 
                  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); 
                  border: 2px solid #3b82f6; 
                  border-radius: 12px; 
                  padding: 24px; 
                  margin: 32px 0; 
                  text-align: center;
              }
              .action-text { font-size: 16px; color: #1e40af; font-weight: 500; }
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
              .footer-bottom { font-size: 14px; color: #fca5a5; padding-top: 20px; border-top: 1px solid rgba(239, 68, 68, 0.3); position: relative; z-index: 1; }
              @media (max-width: 600px) {
                  .container { margin: 20px; border-radius: 16px; }
                  .header, .content { padding: 40px 24px; }
                  .greeting { font-size: 28px; }
                  .alert-icon { font-size: 64px; }
                  .contact-row { flex-direction: column; }
                  .contact-label { min-width: auto; margin-bottom: 4px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">InkDesk Admin</div>
                  <div class="tagline">Contact Form Notification</div>
              </div>

              <div class="content">
                  <div class="alert-icon">🔔</div>
                  <div class="greeting">New Contact Submission!</div>
                  <div class="message">
                      You have received a new contact form submission from your InkDesk website. Please review the details below and respond accordingly.
                  </div>

                  <div class="contact-card">
                      <div class="contact-title">👤 Customer Contact Details</div>
                      <div class="contact-details">
                          <div class="contact-row">
                              <div class="contact-label">Name:</div>
                              <div class="contact-value">${contactData.name}</div>
                          </div>
                          <div class="contact-row">
                              <div class="contact-label">Email:</div>
                              <div class="contact-value">${contactData.email}</div>
                          </div>
                          <div class="contact-row">
                              <div class="contact-label">Subject:</div>
                              <div class="contact-value">${contactData.subject}</div>
                          </div>
                          <div class="contact-row">
                              <div class="contact-label">Submitted:</div>
                              <div class="contact-value">${new Date().toLocaleDateString('en-IN', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                              })}</div>
                          </div>
                      </div>
                      <div class="message-text">
                          <strong>Customer Message:</strong><br><br>
                          ${contactData.message}
                      </div>
                  </div>

                  <div class="action-info">
                      <div class="action-text">
                          💡 Remember to reply to ${contactData.email} within 24 hours for the best customer experience!
                      </div>
                  </div>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-text">Admin Dashboard Notification System</div>
                  <div class="footer-bottom">
                      © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                      This notification was sent to the admin panel
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

        const text = `
      New Contact Form Submission - InkDesk

      You have received a new contact form submission from your website.

      Customer Details:
      Name: ${contactData.name}
      Email: ${contactData.email}
      Subject: ${contactData.subject}
      Submitted: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      })}

      Customer Message:
      "${contactData.message}"

      Please reply to ${contactData.email} within 24 hours for the best customer experience.

      InkDesk Admin Team
    `;

        return {
            subject: '🔔 New Contact Form Submission - InkDesk',
            html,
            text
        };
    }
};