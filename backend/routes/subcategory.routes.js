const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategory.controller');

// Public routes for user frontend only
router.get('/', subcategoryController.getSubcategories);
router.get('/by-category/:categoryId', subcategoryController.getSubcategoriesByCategory);
router.get('/by-category-name/:categoryName', subcategoryController.getSubcategoriesByName);
router.get('/:id', subcategoryController.getSubcategoryById);

module.exports = router;