const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { userAuth } = require('../middleware/userAuth.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/send-otp', userAuth, authController.sendVerificationEmail);
router.post('/verify-account', userAuth, authController.verifyAccount);

router.post('/is-auth', userAuth, authController.isAuthenticated);

router.post('/forget-password-otp', authController.sendResetPasswordEmail);
router.post('/reset-password', authController.resetPassword);
router.put('/change-password',userAuth, authController.changePassword);

router.post('/update-profile', userAuth, authController.updateUserProfile);
router.post('/update-address', userAuth, authController.updateUserAddress);

// Protected profile route - userAuth will extract userId from cookie token
router.get('/profile', userAuth, authController.getProfile);

module.exports = router;