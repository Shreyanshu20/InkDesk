const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// Import middleware
const { userAuth } = require('../middleware/userAuth');

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Authentication routes using controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Email verification routes
router.post('/sendVerificationEmail', userAuth, authController.sendVerificationEmail);
router.post('/verifyAccount', userAuth, authController.verifyAccount);

// Password reset routes
router.post('/sendResetPasswordEmail', authController.sendResetPasswordEmail);
router.post('/resetPassword', authController.resetPassword);

// User authentication and profile routes
router.post('/is-auth', authController.isAuth);
router.post('/is-admin', authController.isAuth); // Will check admin in controller
router.get('/profile', userAuth, authController.getProfile); // FIXED: Use getProfile

// Profile management routes
router.post('/update-profile', userAuth, authController.updateProfile); // FIXED: Use updateProfile
router.post('/update-address', userAuth, authController.updateAddress); // FIXED: Use updateAddress
router.put('/change-password', userAuth, authController.changePassword);
router.delete('/delete-account', userAuth, authController.deleteAccount);

module.exports = router;