module.exports.contactEmailTemplates = {

    contactConfirmation: (contactData) => {
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #dc2626; padding: 30px 20px; text-align: center; color: white; }
              .logo { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
              .tagline { font-size: 14px; opacity: 0.9; }
              .content { padding: 30px 20px; }
              .greeting { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 15px; text-align: center; }
              .message { font-size: 16px; margin-bottom: 25px; text-align: center; color: #666; }
              .contact-card { background: #f8f9fa; border: 1px solid #dc2626; border-radius: 8px; padding: 20px; margin: 25px 0; }
              .contact-title { font-size: 18px; color: #dc2626; font-weight: bold; margin-bottom: 15px; text-align: center; }
              .contact-details { margin-bottom: 20px; }
              .contact-row { display: flex; margin-bottom: 10px; }
              .contact-label { font-weight: bold; color: #dc2626; min-width: 100px; }
              .contact-value { color: #333; flex: 1; }
              .message-text { background: #fff; border-left: 4px solid #dc2626; padding: 15px; border-radius: 0 5px 5px 0; margin-top: 15px; color: #333; }
              .action-info { background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
              .action-text { font-size: 16px; color: #1976d2; }
              .footer { background: #333; color: #ccc; text-align: center; padding: 20px; }
              .footer-logo { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
              .footer-bottom { font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #555; }
              @media (max-width: 600px) {
                  .container { margin: 10px; }
                  .content { padding: 20px 15px; }
                  .contact-row { flex-direction: column; }
                  .contact-label { min-width: auto; margin-bottom: 5px; }
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
                  <div class="greeting">New Contact Message</div>
                  <div class="message">
                      You have received a new contact form submission from your website.
                  </div>

                  <div class="contact-card">
                      <div class="contact-title">Contact Details</div>
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
                              <div class="contact-label">Date:</div>
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
                          <strong>Message:</strong><br><br>
                          ${contactData.message}
                      </div>
                  </div>

                  <div class="action-info">
                      <div class="action-text">
                          Please reply to ${contactData.email} within 24 hours.
                      </div>
                  </div>
              </div>

              <div class="footer">
                  <div class="footer-logo">InkDesk</div>
                  <div class="footer-bottom">
                      © ${new Date().getFullYear()} InkDesk. All rights reserved.<br>
                      Admin notification system
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

        const text = `
      New Contact Form Submission - InkDesk

      Contact Details:
      Name: ${contactData.name}
      Email: ${contactData.email}
      Subject: ${contactData.subject}
      Date: ${new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      })}

      Message:
      ${contactData.message}

      Please reply to ${contactData.email} within 24 hours.

      InkDesk Admin Team
    `;

        return {
            subject: 'New Contact Form Submission - InkDesk',
            html,
            text
        };
    }
};