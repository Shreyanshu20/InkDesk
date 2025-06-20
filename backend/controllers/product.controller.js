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
      filter.$or = [
        { product_name: { $regex: search, $options: 'i' } },
        { product_description: { $regex: search, $options: 'i' } },
        { product_brand: { $regex: search, $options: 'i' } }
      ];
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