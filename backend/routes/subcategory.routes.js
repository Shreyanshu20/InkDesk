const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const { category_id } = req.query;
    
    if (category_id) {
      // Get subcategories for a specific category using the category model
      const category = await Category.findById(category_id)
        .populate('subcategories');
      
      if (!category) {
        return res.json({
          success: true,
          subcategories: []
        });
      }
      
      res.json({
        success: true,
        subcategories: category.subcategories
      });
    } else {
      // Get all subcategories
      const subcategories = await SubCategory.find()
        .sort({ subcategory_name: 1 });
      
      res.json({
        success: true,
        subcategories
      });
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
});

// Get subcategories by category ID (using category model)
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    console.log('🔍 Fetching subcategories for category:', categoryId);
    
    // Find category and populate its subcategories
    const category = await Category.findById(categoryId)
      .populate('subcategories');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    console.log('📋 Found subcategories:', category.subcategories);
    
    res.json({
      success: true,
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
});

// Get subcategories by category name (using category model)
router.get('/by-category-name/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    console.log('🔍 Fetching subcategories for category name:', categoryName);
    
    // Find category by name and populate its subcategories
    const category = await Category.findOne({ 
      category_name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    }).populate('subcategories');
    
    if (!category) {
      return res.json({
        success: true,
        subcategories: [],
        message: 'Category not found'
      });
    }
    
    console.log('📋 Found subcategories for category:', category.category_name, category.subcategories);
    
    res.json({
      success: true,
      subcategories: category.subcategories || []
    });
  } catch (error) {
    console.error('Error fetching subcategories by category name:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
});

module.exports = router;