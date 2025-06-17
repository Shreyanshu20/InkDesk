const express = require('express');
const { transporter } = require('../config/nodemailer');
const { contactEmailTemplate } = require('../config/contactEmailTemplate');
const router = express.Router();

router.post('/send-message', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        console.log('📧 Contact form submission received:', { 
            name, 
            email, 
            subject: subject || 'No subject',
            messageLength: message?.length 
        });

        // Basic validation
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            console.log('❌ Validation failed - missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        // Generate email template
        const emailTemplate = contactEmailTemplate({ 
            name: name.trim(), 
            email: email.trim(), 
            subject: subject?.trim() || 'No subject', 
            message: message.trim() 
        });

        // Use the EXACT same pattern as your auth emails
        const mailOptions = {
            from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
            to: process.env.SENDER_EMAIL, // Send to yourself
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text
        };

        console.log('📧 Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: emailTemplate.subject
        });

        await transporter.sendMail(mailOptions);
        
        console.log('✅ Contact email sent successfully');

        res.json({
            success: true,
            message: 'Message sent successfully! We\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again.'
        });
    }
});

// Test route - using same pattern as your existing code  
router.get('/test-email', async (req, res) => {
    try {
        console.log('🧪 Testing email configuration...');
        
        const testTemplate = contactEmailTemplate({
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Contact Form',
            message: 'This is a test message to verify the contact form is working properly.'
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
            to: process.env.SENDER_EMAIL,
            subject: 'Test Email - Contact Form Setup',
            html: testTemplate.html,
            text: testTemplate.text
        };

        console.log('📧 Sending test email...');
        await transporter.sendMail(mailOptions);
        
        console.log('✅ Test email sent successfully');

        res.json({
            success: true,
            message: 'Test email sent successfully!',
            config: {
                from: mailOptions.from,
                to: mailOptions.to
            }
        });

    } catch (error) {
        console.error('❌ Test email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Test email failed',
            error: error.message
        });
    }
});

module.exports = router;