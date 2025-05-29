const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model'); // Note the capital C

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ category_name: 1 });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get all categories with their subcategories populated
router.get('/with-subcategories', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('subcategories')
      .sort({ category_name: 1 });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories with subcategories',
      error: error.message
    });
  }
});

// Get category by ID WITH SUBCATEGORY NAMES
router.get('/:id', async (req, res) => {
  try {
    console.log('📦 Fetching category with ID:', req.params.id);
    
    const category = await Category.findById(req.params.id).populate({
      path: 'subcategories',
      select: 'subcategory_name'
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    console.log('✅ Found category:', category.category_name);
    console.log('📋 Subcategories:', category.subcategories.map(sub => sub.subcategory_name));
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('❌ Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    console.log('📦 Creating category:', req.body);
    const { category_name, category_image, subcategories } = req.body;
    
    // Create the category first
    const category = new Category({
      category_name,
      category_image: category_image || '',
      subcategories: []
    });
    
    const savedCategory = await category.save();
    
    // Create subcategories if provided
    if (subcategories && subcategories.length > 0) {
      const subcategoryDocs = await Promise.all(
        subcategories.map(subName => {
          const subcategory = new SubCategory({
            subcategory_name: subName,
            category_id: savedCategory._id
          });
          return subcategory.save();
        })
      );
      
      // Update category with subcategory IDs
      savedCategory.subcategories = subcategoryDocs.map(sub => sub._id);
      await savedCategory.save();
    }
    
    // Populate and return
    const populatedCategory = await Category.findById(savedCategory._id).populate({
      path: 'subcategories',
      select: 'subcategory_name'
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: populatedCategory
    });
  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    console.log('📦 Updating category:', req.params.id, req.body);
    
    const { category_name, category_image, subcategories } = req.body;
    
    // Find the category first
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Update basic fields
    category.category_name = category_name;
    category.category_image = category_image || '';
    
    // Handle subcategories update
    if (subcategories) {
      // Delete old subcategories for this category
      await SubCategory.deleteMany({ category_id: category._id });
      
      // Create new subcategories if provided
      if (subcategories.length > 0) {
        const subcategoryDocs = await Promise.all(
          subcategories.map(subName => {
            const subcategory = new SubCategory({
              subcategory_name: subName,
              category_id: category._id
            });
            return subcategory.save();
          })
        );
        
        // Update category with new subcategory IDs
        category.subcategories = subcategoryDocs.map(sub => sub._id);
      } else {
        category.subcategories = [];
      }
    }
    
    // Save the updated category
    await category.save();
    
    // Populate and return the updated category
    const updatedCategory = await Category.findById(category._id).populate({
      path: 'subcategories',
      select: 'subcategory_name'
    });
    
    console.log('✅ Updated category with subcategories:', updatedCategory.subcategories.length);
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('❌ Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

// Add this route to fix subcategory relationships
router.post('/fix-relationships', async (req, res) => {
  try {
    console.log('🔧 Fixing subcategory relationships...');
    
    const categories = await Category.find();
    const subcategories = await SubCategory.find();
    
    let fixedCount = 0;
    
    for (const category of categories) {
      const relatedSubcategories = subcategories.filter(sub => 
        sub.category_id.toString() === category._id.toString()
      );
      
      if (relatedSubcategories.length > 0) {
        category.subcategories = relatedSubcategories.map(sub => sub._id);
        await category.save();
        fixedCount++;
        
        console.log(`✅ Fixed ${category.category_name}: ${relatedSubcategories.length} subcategories`);
      }
    }
    
    res.json({
      success: true,
      message: `Fixed relationships for ${fixedCount} categories`,
      fixedCount
    });
    
  } catch (error) {
    console.error('❌ Error fixing relationships:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix relationships',
      error: error.message
    });
  }
});

module.exports = router;