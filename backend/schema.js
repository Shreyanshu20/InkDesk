const Joi = require('joi');

module.exports.productsSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
    }).required()
});

module.exports.categorySchema = Joi.object({
    category: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.subCategorySchema = Joi.object({
    subcategory: Joi.object({
        name: Joi.string().required(),
        category_id: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.cartSchema = Joi.object({
    cart: Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    }).required()
});

module.exports.wishlistSchema = Joi.object({
    wishlist: Joi.object({
        product_id: Joi.string().required()
    }).required()
});

module.exports.orderSchema = Joi.object({
    order: Joi.object({
        order_id: Joi.string().required(),
        product_id: Joi.string().required(),
        payment_type: Joi.string().required(),
        payment_id: Joi.string().required(),
        payment_status: Joi.string().required(),
        order_status: Joi.string().required(),
        delivery_address: Joi.string().required(),
        total_amount: Joi.number().required(),
        items: Joi.array().items(
            Joi.object({
                product_id: Joi.string().required(),
                quantity: Joi.number().required(),
                price: Joi.number().required()
            })
        ).required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        user_id: Joi.string().required(),
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        product_id: Joi.string().required(),
    }).required()
});