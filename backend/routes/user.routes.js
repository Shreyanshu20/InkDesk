const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleware/userAuth');
const userController = require('../controllers/user.controller');

router.use(userAuth);

// ========== USER PROFILE MANAGEMENT ROUTES ==========//
router.get('/profile', userController.getProfile);
router.post('/update-profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.delete('/delete-account', userController.deleteAccount);

// ========== USER ADDRESS MANAGEMENT ROUTES ==========//
router.get('/addresses', userController.getAddress);
router.post('/addresses', userController.saveAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

module.exports = router;