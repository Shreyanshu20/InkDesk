const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { userAuth } = require('../middleware/userAuth.js');

// Existing routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Add the missing routes that your frontend is calling
router.post('/logout', authController.logout);
router.post('/is-auth', userAuth, authController.isAuth);
router.get('/profile', userAuth, authController.getUserProfile);
router.post('/update-profile', userAuth, authController.updateUserProfile);
router.post('/update-address', userAuth, authController.updateUserAddress);
router.put('/change-password', userAuth, authController.changePassword);
router.delete('/delete-account', userAuth, authController.deleteAccount);

module.exports = router;