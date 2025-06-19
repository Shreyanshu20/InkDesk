const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Public routes for user frontend only
router.get('/', categoryController.getCategories);
router.get('/with-subcategories', categoryController.getCategoriesWithSubcategories);
router.get('/:id', categoryController.getCategoryById);

module.exports = router;