const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/User.model');
const Category = require('../models/category.model');
const Review = require('../models/review.model');

// ========== PRODUCT MANAGEMENT CONTROLLER FUNCTIONS ==========//
// READ operations - accessible by both admin and user
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

        const userId = req.userId;
        let filter = {};

        if (search && search.trim()) {
            filter.$or = [
                { product_name: { $regex: search, $options: 'i' } },
                { product_description: { $regex: search, $options: 'i' } },
                { product_brand: { $regex: search, $options: 'i' } },
                { product_category: { $regex: search, $options: 'i' } },
                { product_subcategory: { $regex: search, $options: 'i' } }
            ];
        }

        if (selectedCategories && selectedCategories !== 'all') {
            const categoryIds = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
            filter.category = { $in: categoryIds };
        }

        if (category && category !== 'all') {
            filter.product_category = { $regex: new RegExp(category, 'i') };
        }

        if (subcategory && subcategory !== 'all') {
            filter.product_subcategory = { $regex: new RegExp(subcategory, 'i') };
        }

        if (brand && brand !== 'all') {
            const brands = Array.isArray(brand) ? brand : [brand];
            filter.product_brand = { $in: brands };
        }

        if (maxPrice) {
            filter.product_price = { $lte: parseFloat(maxPrice) };
        }

        if (inStock === 'true') {
            filter.product_stock = { $gt: 0 };
        } else if (inStock === 'false') {
            filter.product_stock = { $lte: 0 };
        }

        if (status === 'active') {
            filter.product_stock = { $gt: 0 };
        } else if (status === 'out_of_stock') {
            filter.product_stock = { $lte: 0 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

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

        const products = await Product.find(filter)
            .populate('category', 'category_name')
            .populate('owner', 'first_name last_name email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / parseInt(limit));

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
        res.status(500).json({
            success: false,
            message: 'Error fetching admin products',
            error: error.message
        });
    }
};

module.exports.getAdminStats = async (req, res) => {
    try {
        const userId = req.userId;

        const stats = await Promise.all([
            Product.countDocuments({}),
            Product.countDocuments({ product_stock: { $gt: 0 } }),
            Product.countDocuments({ product_stock: { $lte: 0 } }),
            Product.aggregate([
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
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

module.exports.getAdminProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const product = await Product.findById(id)
            .populate('category', 'category_name')
            .populate('owner', 'first_name last_name email');

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
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// WRITE operations - admin only
module.exports.createProduct = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            product_name,
            product_description,
            product_price,
            product_stock,
            product_category,
            product_images,
            product_image
        } = req.body;

        if (!product_name || !product_description || !product_price || product_stock === undefined || !product_category) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, description, price, stock, category'
            });
        }

        let categoryId = null;
        if (product_category) {
            const category = await Category.findOne({
                category_name: { $regex: new RegExp(`^${product_category}$`, 'i') }
            });
            if (category) {
                categoryId = category._id;
            }
        }

        let processedImages = [];

        if (product_images && Array.isArray(product_images) && product_images.length > 0) {
            processedImages = product_images.map((img, index) => ({
                url: img.url || img,
                public_id: img.public_id || '',
                alt_text: img.alt_text || `${product_name} - Image ${index + 1}`
            }));
        } else if (product_image) {
            processedImages = [{
                url: product_image,
                public_id: '',
                alt_text: product_name
            }];
        }

        const productData = {
            ...req.body,
            owner: userId,
            category: categoryId,
            product_images: processedImages,
            product_image: processedImages.length > 0 ? processedImages[0].url : '',
            product_rating: 0,
            review_count: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const product = new Product(productData);
        const savedProduct = await product.save();

        const populatedProduct = await Product.findById(savedProduct._id)
            .populate('category', 'category_name');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: populatedProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own products'
            });
        }

        let updateData = { ...req.body, updatedAt: new Date() };

        if (req.body.product_category) {
            const category = await Category.findOne({
                category_name: { $regex: new RegExp(`^${req.body.product_category}$`, 'i') }
            });
            if (category) {
                updateData.category = category._id;
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'category_name');

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own products'
            });
        }

        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

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

        const deleteResult = await Product.deleteMany({
            _id: { $in: productIds },
            owner: userId
        });

        res.json({
            success: true,
            message: `Successfully deleted ${deleteResult.deletedCount} products`,
            deletedCount: deleteResult.deletedCount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting products',
            error: error.message
        });
    }
};

// ========== CATEGORY MANAGEMENT CONTROLLER FUNCTIONS ==========//
// READ operations - accessible by both admin and user
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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
};

module.exports.getAdminCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category'
        });
    }
};

module.exports.getAdminSubCategories = async (req, res) => {
    try {
        const { id } = req.params;

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories'
        });
    }
};

// WRITE operations - admin only
module.exports.createAdminCategory = async (req, res) => {
    try {
        const { category_name, category_image, description } = req.body;

        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

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

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
};

module.exports.updateAdminCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, category_image, description } = req.body;

        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

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

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
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
        res.status(500).json({
            success: false,
            message: 'Failed to delete category'
        });
    }
};

// ========== SUBCATEGORY MANAGEMENT CONTROLLER FUNCTIONS ==========//
// READ operations - accessible by both admin and user
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

        let query = {};

        if (category_id && category_id !== 'all') {
            query.category_id = category_id;
        }

        if (search) {
            query.subcategory_name = { $regex: search, $options: 'i' };
        }

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories',
            error: error.message
        });
    }
};

module.exports.getAdminSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategory'
        });
    }
};

// WRITE operations - admin only
module.exports.createAdminSubcategory = async (req, res) => {
    try {
        const { subcategory_name, category_id, subcategory_image } = req.body;

        if (!subcategory_name || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory name and category ID are required'
            });
        }

        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

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

        category.subcategories.push(savedSubcategory._id);
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Subcategory created successfully',
            subcategory: savedSubcategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create subcategory',
            error: error.message
        });
    }
};

module.exports.updateAdminSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { subcategory_name, subcategory_image } = req.body;

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
        res.status(500).json({
            success: false,
            message: 'Failed to update subcategory',
            error: error.message
        });
    }
};

module.exports.deleteAdminSubcategory = async (req, res) => {
    try {
        const { id } = req.params;

        const SubCategory = require('../models/subCategory.model');
        const subcategory = await SubCategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
        }

        const productsUsingSubcategory = await Product.countDocuments({
            product_subcategory: subcategory.subcategory_name
        });

        if (productsUsingSubcategory > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete subcategory. It is being used by ${productsUsingSubcategory} product(s).`
            });
        }

        await Category.findByIdAndUpdate(
            subcategory.category_id,
            { $pull: { subcategories: id } }
        );

        await SubCategory.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Subcategory deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete subcategory',
            error: error.message
        });
    }
};

// ========== ORDER MANAGEMENT CONTROLLER FUNCTIONS ==========//
// READ operations - accessible by both admin and user
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

        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');

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

        let sortObject = {};
        if (sortBy === 'user_id') {
            sortObject.createdAt = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'total_amount') {
            sortObject.total_amount = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

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

        const totalOrders = await Order.countDocuments(query);

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

module.exports.getOrderStats = async (req, res) => {
    try {
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

        const completedOrders = allOrders.filter(o =>
            o.status !== 'cancelled' && o.total_amount > 0
        );
        if (completedOrders.length > 0) {
            stats.averageOrderValue = stats.totalRevenue / completedOrders.length;
        }

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order statistics'
        });
    }
};

module.exports.getAdminOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

// WRITE operations - admin only
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

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
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

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
};

// ========== USER MANAGEMENT CONTROLLER FUNCTIONS ==========//
// READ operations - accessible by both admin and user
module.exports.getUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { first_name: searchRegex },
                { last_name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ];
        }

        let sortObject = {};
        if (sortBy === 'name') {
            sortObject.first_name = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select('-password -verify_Otp -forget_password_otp')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalUsers = await User.countDocuments(query);

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

module.exports.getUserStats = async (req, res) => {
    try {
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

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics'
        });
    }
};

module.exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const user = await User.findById(id).select('-password -verify_Otp -forget_password_otp');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const orders = await Order.find({ user_id: id })
            .select('_id order_number status total_amount createdAt items')
            .populate('items.product_id', 'product_name product_price')
            .sort({ createdAt: -1 })
            .limit(20);

        const activityLog = [];

        orders.forEach(order => {
            activityLog.push({
                type: 'order',
                message: `Placed order #${order.order_number || order._id.toString().slice(-8)} - ${order.status}`,
                timestamp: order.createdAt,
                details: {
                    orderId: order._id,
                    status: order.status,
                    amount: order.total_amount
                }
            });
        });

        activityLog.push({
            type: 'account',
            message: 'Account created',
            timestamp: user.createdAt
        });

        activityLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
                updatedAt: user.updatedAt,
                orders: orders,
                activityLog: activityLog,
                twoFactorEnabled: false,
                sessions: [],
                address: user.address_details || null,
                notes: user.notes || ''
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

module.exports.getUserAddresses = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userWithAddresses = await User.findById(id).populate('address_details');

        res.json({
            success: true,
            addresses: userWithAddresses.address_details || []
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user addresses'
        });
    }
};

// WRITE operations - admin only
module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone, role, status } = req.body;

        if (!first_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name and email are required'
            });
        }

        const validRoles = ['user', 'admin', 'manager', 'customer'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        const validStatuses = ['active', 'inactive', 'suspended', 'pending'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status specified'
            });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (email !== existingUser.email) {
            const emailExists = await User.findOne({
                _id: { $ne: id },
                email: email.toLowerCase()
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use by another user'
                });
            }
        }

        const updateData = {
            first_name: first_name.trim(),
            last_name: (last_name || '').trim(),
            email: email.toLowerCase().trim(),
            role: role || existingUser.role || 'user',
            status: status || existingUser.status || 'active',
            updatedAt: new Date()
        };

        if (phone !== undefined) {
            updateData.phone = phone.trim();
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
                upsert: false
            }
        ).select('-password -verify_Otp -forget_password_otp');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Failed to update user'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

module.exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'inactive', 'suspended', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required (active, inactive, suspended, pending)'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password -verify_Otp -forget_password_otp');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User status updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userOrders = await Order.countDocuments({ user_id: id });

        if (userOrders > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete user. They have ${userOrders} order(s). Consider suspending instead.`
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

// ========== REVIEW MANAGEMENT CONTROLLER FUNCTIONS ==========//
// READ operations - accessible by both admin and user
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

        let query = {};

        if (rating && rating !== 'all') {
            query.rating = parseInt(rating);
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');

            const matchingUsers = await User.find({
                $or: [
                    { first_name: searchRegex },
                    { last_name: searchRegex },
                    { email: searchRegex }
                ]
            }).select('_id');

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

        let sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const reviews = await Review.find(query)
            .populate('user_id', 'first_name last_name email avatar')
            .populate('product_id', 'product_name product_image category')
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalReviews = await Review.countDocuments(query);

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
};

module.exports.getReviewStats = async (req, res) => {
    try {
        const allReviews = await Review.find({});

        const stats = {
            total: allReviews.length,
            rating5: allReviews.filter(r => r.rating === 5).length,
            rating4: allReviews.filter(r => r.rating === 4).length,
            rating3: allReviews.filter(r => r.rating === 3).length,
            rating2: allReviews.filter(r => r.rating === 2).length,
            rating1: allReviews.filter(r => r.rating === 1).length,
            averageRating: 0
        };

        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            stats.averageRating = Number((totalRating / allReviews.length).toFixed(1));
        }

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review statistics'
        });
    }
};

// WRITE operations - admin only
module.exports.deleteAdminReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const productId = review.product_id;

        await Review.findByIdAndDelete(reviewId);

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
            // Silent fail for rating update
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
};