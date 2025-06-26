const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// ========== CATEGORY ROUTES ==========//
router.get('/', categoryController.getCategories);
router.get('/with-subcategories', categoryController.getCategoriesWithSubcategories);
router.get('/subcategories/:categoryId', categoryController.getSubcategoriesByCategory);

module.exports = router;