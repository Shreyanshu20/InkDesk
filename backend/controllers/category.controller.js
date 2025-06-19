const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

// Get all categories
module.exports.getCategories = async (req, res) => {
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
module.exports.getCategoriesWithSubcategories = async (req, res) => {
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
          subcategories: subcategories,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
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
module.exports.getCategoryById = async (req, res) => {
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
        subcategories: subcategories,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
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
module.exports.getSubcategories = async (req, res) => {
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

// Get subcategories by category ID
module.exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subcategories = await SubCategory.find({ category_id: categoryId })
      .sort({ subcategory_name: 1 });

    res.json({
      success: true,
      subcategories
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
