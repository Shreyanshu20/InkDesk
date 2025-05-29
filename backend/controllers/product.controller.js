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

// Add create and update functions
const createProduct = async (req, res) => {
  try {
    const userId = req.userId; // From userAuth middleware
    const productData = {
      ...req.body,
      owner: userId // Set the owner to the authenticated user
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log(`✅ Product created by owner ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
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

const updateProduct = async (req, res) => {
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
        message: 'You can only update your own products'
      });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate('category', 'category_name');

    console.log(`✅ Product ${id} updated by owner ${userId}`);

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

module.exports = {
  getProducts,
  getProductById,
  getBrands,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,
  createProduct,   // Add these
  updateProduct,   // Add these
  deleteProduct    // Add these
};