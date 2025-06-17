const contactEmailTemplate = (contactData) => {
    const { name, email, subject, message } = contactData;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission - InkDesk</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f8f9fa; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff; 
                border-radius: 8px; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                font-size: 24px; 
                margin-bottom: 10px; 
            }
            .content { 
                padding: 30px 20px; 
            }
            .message-box { 
                background-color: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #667eea; 
            }
            .footer { 
                background-color: #343a40; 
                color: white; 
                padding: 20px; 
                text-align: center; 
            }
            .detail-row {
                margin-bottom: 15px;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-label {
                font-weight: bold;
                color: #555;
                margin-bottom: 5px;
            }
            .detail-value {
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📬 New Contact Message</h1>
                <p>Someone reached out through InkDesk website</p>
            </div>
            <div class="content">
                <div class="detail-row">
                    <div class="detail-label">From:</div>
                    <div class="detail-value">${name}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${email}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Subject:</div>
                    <div class="detail-value">${subject}</div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-label">Submitted:</div>
                    <div class="detail-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                </div>
                
                <div class="message-box">
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 8px;">
                    <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a>
                </div>
            </div>
            <div class="footer">
                <p><strong>InkDesk</strong> - Contact Form Notification</p>
                <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                    This message was sent through your website contact form
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    const text = `
New Contact Form Submission - InkDesk

From: ${name}
Email: ${email}
Subject: ${subject}
Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Message:
${message}

Reply to: ${email}

---
This message was sent through your InkDesk website contact form.
    `.trim();

    return {
        subject: `Contact Form: ${subject} - from ${name}`,
        html,
        text
    };
};

module.exports = { contactEmailTemplate };