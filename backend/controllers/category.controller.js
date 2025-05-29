const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ 
        category_name: 1 // or use a custom order field
      });
    
    // Or define custom order
    const categoryOrder = ['Stationery', 'Office Supplies', 'Art Supplies', 'Craft Materials'];
    const sortedCategories = categoryOrder.map(name => 
      categories.find(cat => cat.category_name === name)
    ).filter(Boolean);
    
    res.json({
      success: true,
      categories: sortedCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories with their subcategories
const getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ category_name: 1 });
    
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await SubCategory.find({ 
          category_id: category._id 
        }).sort({ subcategory_name: 1 });
        
        return {
          _id: category._id,
          category_name: category.category_name,
          category_image: category.category_image,
          subcategories: subcategories
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithSubcategories
    });

  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subcategories = await SubCategory.find({
      category_id: category._id
    }).sort({ subcategory_name: 1 });

    res.json({
      success: true,
      category: {
        _id: category._id,
        category_name: category.category_name,
        category_image: category.category_image,
        subcategories: subcategories
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

// Get all subcategories
const getSubcategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({})
      .populate('category_id', 'category_name')
      .sort({ subcategory_name: 1 });

    res.json({
      success: true,
      subcategories
    });

  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message
    });
  }
};

// Add create and update functions

const createCategory = async (req, res) => {
  try {
    const { category_name, category_image, subcategories } = req.body;
    
    // Create the category first
    const category = new Category({
      category_name,
      category_image,
      sub_category: [] // Will be populated after creating subcategories
    });
    
    const savedCategory = await category.save();
    
    // Create subcategories if provided
    const subcategoryIds = [];
    if (subcategories && subcategories.length > 0) {
      for (const subName of subcategories) {
        const subCategory = new SubCategory({
          subcategory_name: subName,
          category_id: savedCategory._id
        });
        const savedSub = await subCategory.save();
        subcategoryIds.push(savedSub._id);
      }
      
      // Update category with subcategory IDs
      savedCategory.sub_category = subcategoryIds;
      await savedCategory.save();
    }
    
    res.json({
      success: true,
      message: 'Category created successfully',
      category: savedCategory
    });
    
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_image, subcategories } = req.body;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Delete existing subcategories
    await SubCategory.deleteMany({ category_id: id });
    
    // Create new subcategories
    const subcategoryIds = [];
    if (subcategories && subcategories.length > 0) {
      for (const subName of subcategories) {
        const subCategory = new SubCategory({
          subcategory_name: subName,
          category_id: id
        });
        const savedSub = await subCategory.save();
        subcategoryIds.push(savedSub._id);
      }
    }
    
    // Update category
    category.category_name = category_name;
    category.category_image = category_image;
    category.sub_category = subcategoryIds;
    
    const updatedCategory = await category.save();
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
    
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoriesWithSubcategories,
  getCategoryById,
  getSubcategories,
  createCategory,
  updateCategory
};