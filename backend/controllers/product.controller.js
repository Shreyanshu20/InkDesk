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

    // Format products to include proper image data
    const formattedProducts = products.map(product => {
      const productObj = product.toObject();

      // Ensure proper image formatting
      return {
        ...productObj,
        product_images: productObj.product_images && productObj.product_images.length > 0
          ? productObj.product_images.map(img => ({
            url: img.url,
            public_id: img.public_id,
            alt_text: img.alt_text || productObj.product_name
          }))
          : productObj.product_image
            ? [{ url: productObj.product_image, alt_text: productObj.product_name }]
            : [],
        mainImage: productObj.product_images && productObj.product_images.length > 0
          ? productObj.product_images[0].url
          : productObj.product_image || '',
      };
    });

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    console.log(`✅ Found ${formattedProducts.length} products (${totalProducts} total)`);

    res.json({
      success: true,
      products: formattedProducts, // Return formatted products
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

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🔍 Fetching product by ID:', id);

    const product = await Product.findById(id)
      .populate('category', 'category_name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Format the product data to include all images properly
    const productData = {
      ...product.toObject(),
      // Ensure images array is properly formatted
      product_images: product.product_images && product.product_images.length > 0
        ? product.product_images.map(img => ({
          url: img.url,
          public_id: img.public_id,
          alt_text: img.alt_text || product.product_name
        }))
        : product.product_image
          ? [{ url: product.product_image, alt_text: product.product_name }]
          : [],
      // Add mainImage virtual for backward compatibility
      mainImage: product.product_images && product.product_images.length > 0
        ? product.product_images[0].url
        : product.product_image || '',
    };

    console.log('✅ Product found with images:', productData.product_images?.length || 0);

    res.json({
      success: true,
      product: productData
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




module.exports = {
  // Public routes
  getProducts,
  getProductById,
  getBrands,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,

};