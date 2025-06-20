const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_brand: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_discount: {
        type: Number,
        default: 0
    },
    product_images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: false,
            default: ''
        },
        alt_text: {
            type: String,
            default: ''
        }
    }],
    product_image: {
        type: String,
        default: ''
    },
    product_stock: {
        type: Number,
        required: true,
        default: 0
    },
    product_category: {
        type: String,
        required: true
    },
    product_subcategory: {
        type: String,
        required: true
    },
    product_rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    review_count: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

productSchema.virtual('mainImage').get(function() {
    if (this.product_images && this.product_images.length > 0) {
        return this.product_images[0].url;
    }
    return this.product_image || '';
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);