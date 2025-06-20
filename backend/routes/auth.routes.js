const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

const { userAuth } = require('../middleware/userAuth');

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
router.post('/is-admin', authController.isAuth); 

module.exports = router;