const express = require('express');
const router = express.Router();
const { userAuth, adminOnly, adminPanelAuth } = require('../middleware/userAuth');
const bannerController = require('../controllers/banner.controller');

// ========== PUBLIC BANNER ROUTES ==========//
router.get('/', bannerController.getBanners);

// ========== ADMIN BANNER ROUTES ==========//
router.use('/admin', userAuth, adminPanelAuth);

// READ operations - accessible by both admin and user roles
router.get('/admin', bannerController.getAdminBanners);
router.get('/admin/:id', bannerController.getAdminBanner);

// WRITE operations - admin only
router.post('/admin', adminOnly, bannerController.createBanner);
router.put('/admin/:id', adminOnly, bannerController.updateBanner);
router.delete('/admin/:id', adminOnly, bannerController.deleteBanner);
router.patch('/admin/:id/toggle', adminOnly, bannerController.toggleBannerStatus);

module.exports = router;