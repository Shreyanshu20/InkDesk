const Product = require('../models/product.model');
const Category = require('../models/category.model');

module.exports.getProducts = async (req, res) => {
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

    let filter = {};

    if (req.userId) {
      filter.owner = req.userId;
    }

    if (search) {
      console.log("🔍 Main products API called with search:", search);
      
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { product_name: searchRegex },
        { product_description: searchRegex },
        { product_brand: searchRegex },
        { product_category: searchRegex },
        { product_subcategory: searchRegex }
      ];
      
      console.log("🎯 Search filter applied:", filter.$or);
    }

    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({
        category_name: { $regex: new RegExp(category.replace(/-/g, ' '), 'i') }
      });

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    if (selectedCategories) {
      const categoryIds = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
      if (categoryIds.length > 0) {
        filter.category = { $in: categoryIds };
      }
    }

    if (subcategory && subcategory !== 'all') {
      const subcategoryName = subcategory.replace(/-/g, ' ');
      filter.product_subcategory = { $regex: new RegExp(`^${subcategoryName}$`, 'i') };
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      filter.product_brand = { $in: brands };
    }

    if (maxPrice) {
      filter.product_price = { $lte: parseFloat(maxPrice) };
    }

    if (inStock === 'true') {
      filter.product_stock = { $gt: 0 };
    }

    if (featured === 'true') {
      filter.product_rating = { $gte: 4 };
    }

    if (discount === 'true') {
      filter.product_discount = { $gt: 0 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

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

    const products = await Product.find(filter)
      .populate('category', 'category_name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const formattedProducts = products.map(product => {
      const productObj = product.toObject();

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

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.json({
      success: true,
      products: formattedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

module.exports.getProductById = async (req, res) => {
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

    const productData = {
      ...product.toObject(),
      product_images: product.product_images && product.product_images.length > 0
        ? product.product_images.map(img => ({
          url: img.url,
          public_id: img.public_id,
          alt_text: img.alt_text || product.product_name
        }))
        : product.product_image
          ? [{ url: product.product_image, alt_text: product.product_name }]
          : [],
      mainImage: product.product_images && product.product_images.length > 0
        ? product.product_images[0].url
        : product.product_image || '',
    };

    res.json({
      success: true,
      product: productData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

module.exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('product_brand', {
      product_brand: { $ne: null, $ne: "" }
    });

    const sortedBrands = brands.sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      brands: sortedBrands,
      count: sortedBrands.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

module.exports.getProductsByCategory = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

module.exports.getProductsBySubcategory = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

module.exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    console.log("🔍 Search API called with query:", q);

    if (!q || q.trim() === '') {
      console.log("❌ Empty search query provided");
      return res.json({
        success: true,
        products: [],
        total: 0
      });
    }

    const searchTerm = q.trim();
    console.log("🎯 Processing search for:", searchTerm);
    
    const searchRegex = new RegExp(searchTerm, 'i');
    
    // Create a weighted search query for better relevance
    const products = await Product.aggregate([
      {
        $match: {
          $or: [
            { product_name: searchRegex },
            { product_description: searchRegex },
            { product_brand: searchRegex },
            { product_category: searchRegex },
            { product_subcategory: searchRegex }
          ]
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $sum: [
              // Exact name match gets highest score
              { $cond: [{ $regexMatch: { input: "$product_name", regex: new RegExp(`^${searchTerm}$`, 'i') } }, 100, 0] },
              // Name starts with search term
              { $cond: [{ $regexMatch: { input: "$product_name", regex: new RegExp(`^${searchTerm}`, 'i') } }, 50, 0] },
              // Name contains search term
              { $cond: [{ $regexMatch: { input: "$product_name", regex: searchRegex } }, 25, 0] },
              // Brand exact match
              { $cond: [{ $regexMatch: { input: "$product_brand", regex: new RegExp(`^${searchTerm}$`, 'i') } }, 30, 0] },
              // Brand contains
              { $cond: [{ $regexMatch: { input: "$product_brand", regex: searchRegex } }, 15, 0] },
              // Category/subcategory match
              { $cond: [{ $regexMatch: { input: "$product_category", regex: searchRegex } }, 20, 0] },
              { $cond: [{ $regexMatch: { input: "$product_subcategory", regex: searchRegex } }, 20, 0] },
              // Description contains (lowest priority)
              { $cond: [{ $regexMatch: { input: "$product_description", regex: searchRegex } }, 5, 0] }
            ]
          }
        }
      },
      {
        $match: {
          relevanceScore: { $gt: 0 }
        }
      },
      {
        $sort: { 
          relevanceScore: -1,
          product_rating: -1,
          product_name: 1
        }
      },
      {
        $limit: 50 // Increased limit for search results
      }
    ]);

    // Populate category information
    await Product.populate(products, { path: 'category', select: 'category_name' });

    console.log(`✅ Search completed. Found ${products.length} products for "${searchTerm}"`);
    
    // Log first few results for debugging
    if (products.length > 0) {
      console.log("🎯 Top search results:", products.slice(0, 3).map(p => ({
        name: p.product_name,
        brand: p.product_brand,
        score: p.relevanceScore
      })));
    }

    res.json({
      success: true,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};

module.exports.getProductImages = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select('product_images product_image product_name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const images = product.product_images && product.product_images.length > 0
      ? product.product_images
      : product.product_image
        ? [{ url: product.product_image, alt_text: product.product_name }]
        : [];

    res.json({
      success: true,
      images,
      count: images.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product images'
    });
  }
};