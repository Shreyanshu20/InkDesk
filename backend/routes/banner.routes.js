const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller.js');
const { userAuth } = require('../middleware/userAuth.js');

// Public routes
router.get('/', bannerController.getBanners);

// Admin routes (protected)
router.get('/admin', userAuth, bannerController.getAdminBanners);
router.get('/admin/:id', userAuth, bannerController.getAdminBanner);
router.post('/admin', userAuth, bannerController.createBanner);
router.put('/admin/:id', userAuth, bannerController.updateBanner);
router.delete('/admin/:id', userAuth, bannerController.deleteBanner);
router.patch('/admin/:id/toggle', userAuth, bannerController.toggleBannerStatus);

module.exports = router;