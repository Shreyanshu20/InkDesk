const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Get all products with filtering
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 16,
      search,
      category,
      subcategory,
      brand,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      order = 'desc',
      selectedCategories,
      featured,
      discount
    } = req.query;

    console.log('📋 Product query params:', req.query);

    // Build filter object
    let filter = {};

    // 🔥 If this is an admin request (userAuth middleware ran), filter by owner
    if (req.userId) {
      filter.owner = req.userId;
      console.log('🔑 Admin request - filtering by owner:', req.userId);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filtering
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({
        category_name: { $regex: new RegExp(category.replace(/-/g, ' '), 'i') }
      });

      if (categoryDoc) {
        filter.category = categoryDoc._id;
        console.log('🎯 Filtering by category:', categoryDoc.category_name);
      }
    }

    // Handle selectedCategories from filter menu
    if (selectedCategories) {
      const categoryIds = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
      if (categoryIds.length > 0) {
        filter.category = { $in: categoryIds };
        console.log('🎯 Filtering by selected categories:', categoryIds);
      }
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      const subcategoryName = subcategory.replace(/-/g, ' ');
      filter.product_subcategory = { $regex: new RegExp(`^${subcategoryName}$`, 'i') };
      console.log('🎯 Filtering by subcategory:', subcategoryName);
    }

    // Brand filter
    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      filter.product_brand = { $in: brands };
    }

    // Price filter
    if (maxPrice) {
      filter.product_price = { $lte: parseFloat(maxPrice) };
    }

    // Stock filter
    if (inStock === 'true') {
      filter.product_stock = { $gt: 0 };
    }

    // Featured products filter
    if (featured === 'true') {
      filter.product_rating = { $gte: 4 };
    }

    // Discount filter
    if (discount === 'true') {
      filter.product_discount = { $gt: 0 };
    }

    console.log('🔍 Final filter object:', JSON.stringify(filter, null, 2));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    let sort = {};
    if (sortBy === 'product_price') {
      sort = { product_price: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'product_rating') {
      sort = { product_rating: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'product_name') {
      sort = { product_name: order === 'asc' ? 1 : -1 };
    } else {
      sort = { createdAt: order === 'asc' ? 1 : -1 };
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'category_name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    console.log(`✅ Found ${products.length} products (${totalProducts} total)`);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get all products with filtering (Admin version)
const getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      subcategory,
      brand,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      order = 'desc',
      selectedCategories,
      status
    } = req.query;

    const userId = req.userId; // From userAuth middleware
    console.log('🔑 Admin products request - User ID:', userId);

    // Build filter object - only show products owned by this user
    let filter = { owner: userId };

    // Search filter
    if (search && search.trim()) {
      filter.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } },
        { product_category: { $regex: search, $options: 'i' } },
        { product_subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter by ObjectId
    if (selectedCategories && selectedCategories !== 'all') {
      const categoryIds = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
      filter.category = { $in: categoryIds };
    }

    // Category filter by name (fallback)
    if (category && category !== 'all') {
      filter.product_category = { $regex: new RegExp(category, 'i') };
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      filter.product_subcategory = { $regex: new RegExp(subcategory, 'i') };
    }

    // Brand filter
    if (brand && brand !== 'all') {
      const brands = Array.isArray(brand) ? brand : [brand];
      filter.product_brand = { $in: brands };
    }

    // Price filter
    if (maxPrice) {
      filter.product_price = { $lte: parseFloat(maxPrice) };
    }

    // Stock/Status filter
    if (inStock === 'true') {
      filter.product_stock = { $gt: 0 };
    } else if (inStock === 'false') {
      filter.product_stock = { $lte: 0 };
    }

    // Status filter (frontend compatibility)
    if (status === 'active') {
      filter.product_stock = { $gt: 0 };
    } else if (status === 'out_of_stock') {
      filter.product_stock = { $lte: 0 };
    }

    console.log('🔍 Admin filter object:', JSON.stringify(filter, null, 2));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    let sort = {};
    if (sortBy === 'product_price') {
      sort = { product_price: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'product_rating') {
      sort = { product_rating: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'product_name') {
      sort = { product_name: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'product_stock') {
      sort = { product_stock: order === 'asc' ? 1 : -1 };
    } else if (sortBy === 'product_category') {
      sort = { product_category: order === 'asc' ? 1 : -1 };
    } else {
      sort = { createdAt: order === 'asc' ? 1 : -1 };
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'category_name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    console.log(`✅ Found ${products.length} admin products (${totalProducts} total) for user ${userId}`);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching admin products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin products',
      error: error.message
    });
  }
};

// Create product (Admin)
const createProduct = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('➕ Creating product for user:', userId);

    // Validate required fields
    const {
      product_name,
      product_description,
      product_price,
      product_stock,
      product_category
    } = req.body;

    if (!product_name || !product_description || !product_price || product_stock === undefined || !product_category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, price, stock, category'
      });
    }

    // Find category by name to get ObjectId
    let categoryId = null;
    if (product_category) {
      const category = await Category.findOne({
        category_name: { $regex: new RegExp(`^${product_category}$`, 'i') }
      });
      if (category) {
        categoryId = category._id;
      }
    }

    const productData = {
      ...req.body,
      owner: userId,
      category: categoryId, // Add ObjectId reference
      product_rating: 0, // Default rating
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    // Populate category for response
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('category', 'category_name');

    console.log(`✅ Product created successfully:`, savedProduct._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });

  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log(`🔄 Updating product ${id} by user ${userId}`);

    // Find the product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns this product
    if (product.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products'
      });
    }

    // Find category by name if category is being updated
    let updateData = { ...req.body, updatedAt: new Date() };

    if (req.body.product_category) {
      const category = await Category.findOne({
        category_name: { $regex: new RegExp(`^${req.body.product_category}$`, 'i') }
      });
      if (category) {
        updateData.category = category._id;
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'category_name');

    console.log(`✅ Product ${id} updated successfully`);

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product function
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From userAuth middleware

    // Find the product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns this product
    if (product.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products'
      });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('category', 'category_name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Get single product by ID (Admin)
const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log(`🔍 Fetching product ${id} for admin ${userId}`);

    const product = await Product.findOne({ _id: id, owner: userId })
      .populate('category', 'category_name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to view it'
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Bulk delete products (Admin)
const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.userId;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    console.log(`🗑️ Bulk deleting ${productIds.length} products for user ${userId}`);

    // Find products that belong to this user
    const products = await Product.find({
      _id: { $in: productIds },
      owner: userId
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found or you do not have permission to delete them'
      });
    }

    if (products.length !== productIds.length) {
      return res.status(403).json({
        success: false,
        message: `You can only delete your own products. Found ${products.length} of ${productIds.length} products.`
      });
    }

    // Delete the products
    const deleteResult = await Product.deleteMany({
      _id: { $in: productIds },
      owner: userId
    });

    console.log(`✅ Bulk deleted ${deleteResult.deletedCount} products`);

    res.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} products`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error('❌ Error bulk deleting products:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting products',
      error: error.message
    });
  }
};

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await Promise.all([
      Product.countDocuments({ owner: userId }),
      Product.countDocuments({ owner: userId, product_stock: { $gt: 0 } }),
      Product.countDocuments({ owner: userId, product_stock: { $lte: 0 } }),
      Product.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, totalValue: { $sum: { $multiply: ['$product_price', '$product_stock'] } } } }
      ])
    ]);

    const totalProducts = stats[0];
    const activeProducts = stats[1];
    const outOfStockProducts = stats[2];
    const totalInventoryValue = stats[3][0]?.totalValue || 0;

    res.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalInventoryValue
      }
    });

  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Get all unique brands
const getBrands = async (req, res) => {
  try {
    // Get ALL distinct brands from ALL products, not filtered ones
    const brands = await Product.distinct('product_brand', {
      product_brand: { $ne: null, $ne: "" }
    });

    // Sort brands alphabetically
    const sortedBrands = brands.sort((a, b) => a.localeCompare(b));

    console.log('📋 Returning all brands:', sortedBrands);

    res.json({
      success: true,
      brands: sortedBrands,
      count: sortedBrands.length
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products = await Product.find({
      product_category: { $regex: new RegExp(categoryName.replace(/-/g, ' '), 'i') }
    }).populate('category', 'category_name');

    res.json({
      success: true,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get products by subcategory
const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryName } = req.params;

    const products = await Product.find({
      product_subcategory: { $regex: new RegExp(subcategoryName.replace(/-/g, ' '), 'i') }
    }).populate('category', 'category_name');

    res.json({
      success: true,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        products: [],
        total: 0
      });
    }

    const products = await Product.find({
      $or: [
        { product_name: { $regex: q, $options: 'i' } },
        { product_description: { $regex: q, $options: 'i' } },
        { product_category: { $regex: q, $options: 'i' } },
        { product_subcategory: { $regex: q, $options: 'i' } }
      ]
    }).populate('category', 'category_name')
      .limit(20);

    res.json({
      success: true,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};

module.exports = {
  // Public routes
  getProducts,
  getProductById,
  getBrands,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,

  // Admin routes
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  getAdminStats
};