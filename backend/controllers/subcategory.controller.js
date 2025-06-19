const SubCategory = require('../models/subCategory.model');
const Category = require('../models/category.model');

// Get all subcategories for user frontend
module.exports.getSubcategories = async (req, res) => {
  try {
    const { category_id } = req.query;
    
    if (category_id) {
      // Get subcategories for a specific category
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
        .populate('category_id', 'category_name')
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
};

// Get subcategories by category ID for user frontend
module.exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    console.log('🔍 Fetching subcategories for category:', categoryId);
    
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
};

// Get subcategories by category name for user frontend
module.exports.getSubcategoriesByName = async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    console.log('🔍 Fetching subcategories for category name:', categoryName);
    
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
};

// Get single subcategory by ID for user frontend
module.exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subcategory = await SubCategory.findById(id)
      .populate('category_id', 'category_name');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    res.json({
      success: true,
      subcategory
    });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategory'
    });
  }
};