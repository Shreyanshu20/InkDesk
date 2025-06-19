const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Review = require('../models/review.model');


//=============Product Management for Admin=================//
// Get all products with filtering (Admin version)
module.exports.getAdminProducts = async (req, res) => {
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
module.exports.createProduct = async (req, res) => {
    try {
        const userId = req.userId;
        console.log('➕ Creating product for user:', userId);

        // Validate required fields
        const {
            product_name,
            product_description,
            product_price,
            product_stock,
            product_category,
            product_images, // Add this to handle multiple images
            product_image    // Keep for backward compatibility
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
                console.log('📂 Found category:', category.category_name);
            } else {
                console.log('⚠️ Category not found, will use string:', product_category);
            }
        }

        // Handle images - process both new array format and old single image
        let processedImages = [];

        if (product_images && Array.isArray(product_images) && product_images.length > 0) {
            // New multiple images format
            processedImages = product_images.map((img, index) => ({
                url: img.url || img,
                public_id: img.public_id || '',
                alt_text: img.alt_text || `${product_name} - Image ${index + 1}`
            }));
            console.log('📸 Using multiple images:', processedImages.length);
        } else if (product_image) {
            // Backward compatibility - single image
            processedImages = [{
                url: product_image,
                public_id: '',
                alt_text: product_name
            }];
            console.log('📸 Using single image as array');
        }

        const productData = {
            ...req.body,
            owner: userId,
            category: categoryId,
            product_images: processedImages, // Store processed images array
            product_image: processedImages.length > 0 ? processedImages[0].url : '', // Keep main image for compatibility
            product_rating: 0,
            review_count: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const product = new Product(productData);
        const savedProduct = await product.save();

        // Populate category for response
        const populatedProduct = await Product.findById(savedProduct._id)
            .populate('category', 'category_name');

        console.log(`✅ Product created with ${processedImages.length} images:`, savedProduct._id);

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
module.exports.updateProduct = async (req, res) => {
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
module.exports.deleteProduct = async (req, res) => {
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

// Get single product by ID (Admin)
module.exports.getAdminProductById = async (req, res) => {
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
module.exports.bulkDeleteProducts = async (req, res) => {
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
module.exports.getAdminStats = async (req, res) => {
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


//================== Order Management for Admin ==================//

module.exports.getAdminOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        console.log('🔍 Admin orders request:', {
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder
        });

        // Build query for ALL orders (not filtered by seller)
        let query = {};

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');

            // Find users matching search terms
            const matchingUsers = await User.find({
                $or: [
                    { first_name: searchRegex },
                    { last_name: searchRegex },
                    { email: searchRegex }
                ]
            }).select('_id');

            const matchingUserIds = matchingUsers.map(u => u._id);

            query.$or = [
                { order_number: searchRegex },
                { user_id: { $in: matchingUserIds } },
                { 'shipping_address.name': searchRegex }
            ];
        }

        // Build sort object
        let sortObject = {};
        if (sortBy === 'user_id') {
            sortObject.createdAt = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'total_amount') {
            sortObject.total_amount = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        console.log('📊 Query:', JSON.stringify(query, null, 2));
        console.log('🔄 Sort:', sortObject);

        // Get ALL orders with pagination
        const orders = await Order.find(query)
            .populate('user_id', 'first_name last_name email phone')
            .populate({
                path: 'items.product_id',
                select: 'product_name product_price product_image owner'
            })
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count
        const totalOrders = await Order.countDocuments(query);

        console.log(`📦 Found ${orders.length} orders total: ${totalOrders}`);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalOrders / parseInt(limit)),
            totalOrders,
            hasNextPage: parseInt(page) < Math.ceil(totalOrders / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1
        };

        res.json({
            success: true,
            orders: orders,
            pagination
        });

    } catch (error) {
        console.error('❌ Error fetching admin orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

module.exports.getAdminOrderStats = async (req, res) => {
    try {
        console.log('📊 Getting order stats for all orders');

        // Get ALL orders (not filtered by seller)
        const orders = await Order.find({}).select('status');

        // Calculate statistics
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            processing: orders.filter(o => o.status === 'processing').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };

        console.log('📈 Order stats:', stats);

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order statistics',
            error: error.message
        });
    }
};

module.exports.getAdminOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        console.log('🔍 Getting order details:', orderId);

        const order = await Order.findById(orderId)
            .populate('user_id', 'first_name last_name email phone')
            .populate('items.product_id', 'product_name product_price product_image owner');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('❌ Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

module.exports.updateAdminOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required'
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        console.log(`✅ Updated order ${orderId} status to ${status}`);

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('❌ Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
};

module.exports.deleteAdminOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log(`🗑️ Deleted order ${orderId}`);

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
};


// ========== CATEGORY MANAGEMENT ==========

module.exports.getAdminCategories = async (req, res) => {
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

module.exports.getAdminCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🔍 Admin fetching category:', id);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const category = await Category.findById(id)
            .populate('subcategories', 'subcategory_name subcategory_image');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            category: {
                id: category._id,
                _id: category._id,
                category_name: category.category_name,
                category_image: category.category_image || '',
                subcategories: category.subcategories || [],
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            }
        });

    } catch (error) {
        console.error('❌ Error fetching admin category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category'
        });
    }
};

// Update the createAdminCategory function to handle images properly:

module.exports.createAdminCategory = async (req, res) => {
  try {
    const { category_name, category_image, description } = req.body;

    console.log('➕ Admin creating category:', { category_name, category_image });

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

    const category = new Category({
      category_name,
      category_image: category_image || '',
      description: description || ''
    });

    await category.save();

    console.log('✅ Admin category created:', category._id);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('❌ Error creating admin category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Update the updateAdminCategory function to handle images:

module.exports.updateAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_image, description } = req.body;

    console.log('✏️ Admin updating category:', id, { category_name, category_image });

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

    const updateData = {
      category_name,
      description: description || ''
    };

    // Only update image if provided
    if (category_image !== undefined) {
      updateData.category_image = category_image;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subcategories', 'subcategory_name subcategory_image');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    console.log('✅ Admin category updated:', id);

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('❌ Error updating admin category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

module.exports.deleteAdminCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category is being used by any products
        const productsUsingCategory = await Product.countDocuments({
            category: id
        });

        if (productsUsingCategory > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It is being used by ${productsUsingCategory} product(s).`
            });
        }

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

//========== SUBCATEGORY MANAGEMENT ==========//

module.exports.getAdminSubCategories = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🔍 Admin fetching subcategories for category:', id);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const category = await Category.findById(id)
            .populate('subcategories', 'subcategory_name subcategory_image');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            subcategories: category.subcategories || []
        });

    } catch (error) {
        console.error('❌ Error fetching admin category subcategories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories'
        });
    }
};

module.exports.createAdminSubcategory = async (req, res) => {
    try {
        const { subcategory_name, category_id, subcategory_image } = req.body;

        console.log('➕ Admin creating subcategory:', { subcategory_name, category_id });

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
        const SubCategory = require('../models/subCategory.model');
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

        console.log('✅ Admin subcategory created:', savedSubcategory._id);

        res.status(201).json({
            success: true,
            message: 'Subcategory created successfully',
            subcategory: savedSubcategory
        });
    } catch (error) {
        console.error('❌ Error creating admin subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subcategory',
            error: error.message
        });
    }
};

// Update subcategory (Admin)
module.exports.updateAdminSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { subcategory_name, subcategory_image } = req.body;

        console.log('✏️ Admin updating subcategory:', id, { subcategory_name });

        if (!subcategory_name) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory name is required'
            });
        }

        const SubCategory = require('../models/subCategory.model');
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

        console.log('✅ Admin subcategory updated:', id);

        res.json({
            success: true,
            message: 'Subcategory updated successfully',
            subcategory: subcategory
        });
    } catch (error) {
        console.error('❌ Error updating admin subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subcategory',
            error: error.message
        });
    }
};

// Delete subcategory (Admin)
module.exports.deleteAdminSubcategory = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🗑️ Admin deleting subcategory:', id);

        const SubCategory = require('../models/subCategory.model');
        const subcategory = await SubCategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        // Check if subcategory is being used by any products
        const productsUsingSubcategory = await Product.countDocuments({
            product_subcategory: subcategory.subcategory_name
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

        console.log('✅ Admin subcategory deleted:', id);

        res.json({
            success: true,
            message: 'Subcategory deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting admin subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete subcategory',
            error: error.message
        });
    }
};

// Get single subcategory by ID (Admin)
module.exports.getAdminSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🔍 Admin fetching subcategory:', id);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subcategory ID format'
            });
        }

        const SubCategory = require('../models/subCategory.model');
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
            subcategory: {
                id: subcategory._id,
                _id: subcategory._id,
                subcategory_name: subcategory.subcategory_name,
                subcategory_image: subcategory.subcategory_image || '',
                category_id: subcategory.category_id,
                category: subcategory.category_id,
                createdAt: subcategory.createdAt,
                updatedAt: subcategory.updatedAt
            }
        });

    } catch (error) {
        console.error('❌ Error fetching admin subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategory'
        });
    }
};

// Get all subcategories for admin
module.exports.getAdminSubcategoriesList = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category_id = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        console.log('📋 Admin fetching subcategories list:', { page, limit, search, category_id });

        // Build query
        let query = {};

        // Add category filter
        if (category_id && category_id !== 'all') {
            query.category_id = category_id;
        }

        // Add search filter
        if (search) {
            query.subcategory_name = { $regex: search, $options: 'i' };
        }

        // Build sort object
        let sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const SubCategory = require('../models/subCategory.model');
        const subcategories = await SubCategory.find(query)
            .populate('category_id', 'category_name')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit));

        const totalSubcategories = await SubCategory.countDocuments(query);

        console.log(`📋 Found ${subcategories.length} subcategories of ${totalSubcategories} total`);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalSubcategories / parseInt(limit)),
            totalSubcategories,
            hasNextPage: parseInt(page) < Math.ceil(totalSubcategories / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1
        };

        res.json({
            success: true,
            subcategories,
            pagination
        });

    } catch (error) {
        console.error('❌ Error fetching admin subcategories list:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories',
            error: error.message
        });
    }
};

// ========== USER MANAGEMENT ==========//

module.exports.getAdminUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        console.log('🔍 Admin users request:', {
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder
        });

        // Build query
        let query = {};

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { first_name: searchRegex },
                { last_name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ];
        }

        // Build sort object
        let sortObject = {};
        if (sortBy === 'name') {
            sortObject.first_name = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get users with pagination
        const users = await User.find(query)
            .select('-password -verify_Otp -forget_password_otp')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count
        const totalUsers = await User.countDocuments(query);

        console.log(`👥 Found ${users.length} users of ${totalUsers} total`);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / parseInt(limit)),
            total: totalUsers,
            hasNextPage: parseInt(page) < Math.ceil(totalUsers / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1
        };

        res.json({
            success: true,
            users: users,
            pagination
        });

    } catch (error) {
        console.error('❌ Error fetching admin users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

module.exports.getAdminUserById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🔍 Admin fetching user:', id);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                isAccountVerified: user.isAccountVerified,
                shopping_cart: user.shopping_cart || [],
                wishlist: user.wishlist || [],
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('❌ Error fetching admin user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

// ========== REVIEW MANAGEMENT ==========//

module.exports.getAdminReviews = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            rating = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        console.log('🔍 Admin reviews request:', {
            page,
            limit,
            search,
            rating,
            sortBy,
            sortOrder
        });

        // Build query for ALL reviews
        let query = {};

        // Add rating filter
        if (rating && rating !== 'all') {
            query.rating = parseInt(rating);
        }

        // Add search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');

            // Find users matching search terms
            const matchingUsers = await User.find({
                $or: [
                    { first_name: searchRegex },
                    { last_name: searchRegex },
                    { email: searchRegex }
                ]
            }).select('_id');

            // Find products matching search terms
            const matchingProducts = await Product.find({
                product_name: searchRegex
            }).select('_id');

            const matchingUserIds = matchingUsers.map(u => u._id);
            const matchingProductIds = matchingProducts.map(p => p._id);

            query.$or = [
                { comment: searchRegex },
                { user_id: { $in: matchingUserIds } },
                { product_id: { $in: matchingProductIds } }
            ];
        }

        // Build sort object
        let sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get ALL reviews with pagination
        const reviews = await Review.find(query)
            .populate('user_id', 'first_name last_name email avatar')
            .populate('product_id', 'product_name product_image category')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count
        const totalReviews = await Review.countDocuments(query);

        console.log(`📝 Found ${reviews.length} reviews of ${totalReviews} total`);

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalReviews / parseInt(limit)),
            totalReviews,
            hasNextPage: parseInt(page) < Math.ceil(totalReviews / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1
        };

        res.json({
            success: true,
            reviews: reviews,
            pagination
        });

    } catch (error) {
        console.error('❌ Error fetching admin reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
};

module.exports.deleteAdminReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        console.log('🗑️ Admin deleting review:', reviewId);

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const productId = review.product_id;

        await Review.findByIdAndDelete(reviewId);

        // Update product rating after deletion
        try {
            const reviews = await Review.find({ product_id: productId });

            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

                await Product.findByIdAndUpdate(productId, {
                    product_rating: avgRating,
                    review_count: reviews.length
                });
            } else {
                await Product.findByIdAndUpdate(productId, {
                    product_rating: 0,
                    review_count: 0
                });
            }
        } catch (updateError) {
            console.log('⚠️ Error updating product rating:', updateError.message);
        }

        console.log(`✅ Deleted review ${reviewId}`);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
};

// ========== STATISTICS ==========

module.exports.getOrderStats = async (req, res) => {
    try {
        console.log('📊 Getting order statistics for admin');

        const allOrders = await Order.find({});

        const stats = {
            total: allOrders.length,
            pending: allOrders.filter(o => o.status === 'pending').length,
            processing: allOrders.filter(o => o.status === 'processing').length,
            shipped: allOrders.filter(o => o.status === 'shipped').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length,
            totalRevenue: allOrders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, order) => sum + (order.total_amount || 0), 0),
            averageOrderValue: 0,
            todaysOrders: allOrders.filter(o => {
                const today = new Date();
                const orderDate = new Date(o.createdAt);
                return orderDate.toDateString() === today.toDateString();
            }).length,
            thisWeekOrders: allOrders.filter(o => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return new Date(o.createdAt) > oneWeekAgo;
            }).length
        };

        // Calculate average order value
        const completedOrders = allOrders.filter(o =>
            o.status !== 'cancelled' && o.total_amount > 0
        );
        if (completedOrders.length > 0) {
            stats.averageOrderValue = stats.totalRevenue / completedOrders.length;
        }

        console.log('📈 Order stats:', stats);

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order statistics'
        });
    }
};

module.exports.getUserStats = async (req, res) => {
    try {
        console.log('📊 Getting user statistics for admin');

        const allUsers = await User.find({});

        const stats = {
            total: allUsers.length,
            active: allUsers.filter(u => u.status === 'active').length,
            inactive: allUsers.filter(u => u.status === 'inactive').length,
            suspended: allUsers.filter(u => u.status === 'suspended').length,
            admins: allUsers.filter(u => u.role === 'admin').length,
            users: allUsers.filter(u => u.role === 'user').length,
            verifiedUsers: allUsers.filter(u => u.isAccountVerified === true).length,
            recentUsers: allUsers.filter(u => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return new Date(u.createdAt) > oneWeekAgo;
            }).length
        };

        console.log('📈 User stats:', stats);

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics'
        });
    }
};

module.exports.getReviewStats = async (req, res) => {
    try {
        console.log('📊 Getting review stats for admin');

        const allReviews = await Review.find({});

        const stats = {
            totalReviews: allReviews.length,
            averageRating: 0,
            ratingBreakdown: {
                5: allReviews.filter(r => r.rating === 5).length,
                4: allReviews.filter(r => r.rating === 4).length,
                3: allReviews.filter(r => r.rating === 3).length,
                2: allReviews.filter(r => r.rating === 2).length,
                1: allReviews.filter(r => r.rating === 1).length,
            }
        };

        // Calculate average rating
        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            stats.averageRating = Number((totalRating / allReviews.length).toFixed(1));
        }

        console.log('📈 Review stats:', stats);

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Error fetching review stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review statistics'
        });
    }
};
