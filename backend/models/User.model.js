const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    phone: {
        type: String,
        default: null
    },
    verify_Otp: {
        type: String,
        default: ''
    },
    verify_Otp_expiry: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    forget_password_otp: {
        type: String,
        default: ''
    },
    forget_password_otp_expiry: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    address_details: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    shopping_cart: [{
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        added_at: {
            type: Date,
            default: Date.now
        }
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);