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

// Get admin categories with pagination and filters
const getAdminCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;

    let query = {};
    if (search) {
      query.category_name = { $regex: search, $options: 'i' };
    }

    let sort = { createdAt: -1 };
    if (sortBy && sortOrder) {
      const sortDirection = sortOrder === 'ascending' ? 1 : -1;
      sort = { [sortBy]: sortDirection };
    }

    const categories = await Category.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Category.countDocuments(query);

    res.json({
      success: true,
      categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCategories: total,
        hasNextPage: parseInt(page) < Math.ceil(total / limit),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
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

// Create category
const createCategory = async (req, res) => {
  try {
    const { category_name, category_image, subcategories } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    // Create the category first
    const category = new Category({
      category_name,
      category_image: category_image || '',
      subcategories: []
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
      savedCategory.subcategories = subcategoryIds;
      await savedCategory.save();
    }
    
    res.status(201).json({
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

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_image, subcategories } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    
    const category = await Category.findById(id);
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
      const subcategoryIds = [];
      if (subcategories.length > 0) {
        for (const subName of subcategories) {
          const subCategory = new SubCategory({
            subcategory_name: subName,
            category_id: category._id
          });
          const savedSub = await subCategory.save();
          subcategoryIds.push(savedSub._id);
        }
        
        // Update category with new subcategory IDs
        category.subcategories = subcategoryIds;
      } else {
        category.subcategories = [];
      }
    }
    
    // Save the updated category
    await category.save();
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category: category
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

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is being used by any products
    const Product = require('../models/product.model');
    const productsUsingCategory = await Product.countDocuments({
      category: id
    });

    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is being used by ${productsUsingCategory} product(s).`
      });
    }

    // Delete all subcategories for this category
    await SubCategory.deleteMany({ category_id: id });

    // Delete the category
    const category = await Category.findByIdAndDelete(id);

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
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
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

// Get subcategories by category ID
const getSubcategoriesByCategory = async (req, res) => {
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

// Create subcategory
const createSubcategory = async (req, res) => {
  try {
    const { subcategory_name, category_id, subcategory_image } = req.body;

    if (!subcategory_name || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name and category ID are required'
      });
    }

    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if subcategory already exists in this category
    const existingSubcategory = await SubCategory.findOne({
      subcategory_name: { $regex: new RegExp(`^${subcategory_name}$`, 'i') },
      category_id: category_id
    });

    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory already exists in this category'
      });
    }

    const subcategory = new SubCategory({
      subcategory_name,
      subcategory_image: subcategory_image || '',
      category_id
    });

    const savedSubcategory = await subcategory.save();

    // Add subcategory to category's subcategories array
    category.subcategories.push(savedSubcategory._id);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      subcategory: savedSubcategory
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message
    });
  }
};

// Update subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcategory_name, subcategory_image } = req.body;

    if (!subcategory_name) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name is required'
      });
    }

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Check if another subcategory with same name exists in the same category
    const existingSubcategory = await SubCategory.findOne({
      _id: { $ne: id },
      subcategory_name: { $regex: new RegExp(`^${subcategory_name}$`, 'i') },
      category_id: subcategory.category_id
    });

    if (existingSubcategory) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name already exists in this category'
      });
    }

    subcategory.subcategory_name = subcategory_name;
    if (subcategory_image !== undefined) {
      subcategory.subcategory_image = subcategory_image;
    }
    await subcategory.save();

    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      subcategory: subcategory
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subcategory',
      error: error.message
    });
  }
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Check if subcategory is being used by any products
    const Product = require('../models/product.model');
    const productsUsingSubcategory = await Product.countDocuments({
      subcategory: subcategory.subcategory_name
    });

    if (productsUsingSubcategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete subcategory. It is being used by ${productsUsingSubcategory} product(s).`
      });
    }

    // Remove subcategory from category's subcategories array
    await Category.findByIdAndUpdate(
      subcategory.category_id,
      { $pull: { subcategories: id } }
    );

    // Delete the subcategory
    await SubCategory.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoriesWithSubcategories,
  getAdminCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};