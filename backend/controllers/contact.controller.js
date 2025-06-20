const express = require('express');
const { transporter } = require('../config/nodemailer');
const { contactEmailTemplate } = require('../config/contactEmailTemplate');

module.exports.sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        const emailTemplate = contactEmailTemplate({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || 'No subject',
            message: message.trim()
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL || 'noreply@inkdesk.com',
            to: process.env.SENDER_EMAIL,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully! We\'ll get back to you soon.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again.'
        });
    }
}