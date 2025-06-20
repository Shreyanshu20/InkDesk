const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const userController = require('../controllers/user.controller');

// Profile management routes
router.get('/profile', userAuth, userController.getProfile);
router.post('/update-profile', userAuth, userController.updateProfile);
router.put('/change-password', userAuth, userController.changePassword);
router.delete('/delete-account', userAuth, userController.deleteAccount);

// Address management routes
router.get('/addresses', userAuth, userController.getAddress);
router.post('/addresses', userAuth, userController.saveAddress);
router.put('/addresses/:id', userAuth, userController.updateAddress);
router.delete('/addresses/:id', userAuth, userController.deleteAddress);

module.exports = router;