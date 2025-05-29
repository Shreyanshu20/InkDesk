const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    timestamps: true
});

// Create compound index to prevent duplicate entries
wishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('wishlist', wishlistSchema);