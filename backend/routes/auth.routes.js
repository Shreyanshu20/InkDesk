const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const authController = require('../controllers/auth.controller');

// ========== AUTHENTICATION ROUTES ==========//
// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// ========== EMAIL VERIFICATION ROUTES ==========//
// Protected routes
router.post('/sendVerificationEmail', userAuth, authController.sendVerificationEmail);
router.post('/verifyAccount', userAuth, authController.verifyAccount);

// ========== PASSWORD RESET ROUTES ==========//
// Public routes
router.post('/sendResetPasswordEmail', authController.sendResetPasswordEmail);
router.post('/resetPassword', authController.resetPassword);

// ========== USER AUTHENTICATION STATUS ROUTES ==========//
// Auth check routes
router.post('/is-auth', authController.isAuth);
router.post('/is-admin', authController.isAuth);

module.exports = router;