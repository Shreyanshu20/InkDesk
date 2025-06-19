const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller.js');
const { userAuth, adminOnly, adminPanelAuth } = require('../middleware/userAuth.js');

// Public routes - no authentication required
router.get('/', bannerController.getBanners);

// Apply authentication and admin panel access to all admin routes
router.use('/admin', userAuth);
router.use('/admin', adminPanelAuth);

// READ operations - accessible by both admin and user roles
router.get('/admin', bannerController.getAdminBanners);
router.get('/admin/:id', bannerController.getAdminBanner);

// WRITE operations - admin only
router.post('/admin', adminOnly, bannerController.createBanner);
router.put('/admin/:id', adminOnly, bannerController.updateBanner);
router.delete('/admin/:id', adminOnly, bannerController.deleteBanner);
router.patch('/admin/:id/toggle', adminOnly, bannerController.toggleBannerStatus);

module.exports = router;