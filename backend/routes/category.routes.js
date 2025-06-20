const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// get all categories
router.get('/', categoryController.getCategories);

//get all subcategories with categories
router.get('/with-subcategories', categoryController.getCategoriesWithSubcategories);

// get subcategories by category ID
router.get('/subcategories/:categoryId', categoryController.getSubcategoriesByCategory);

module.exports = router;