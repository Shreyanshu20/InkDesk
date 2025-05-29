const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_name: {
        type: String,
        required: true
    },
    category_image: {
        type: String,
        required: false, // Changed to false to allow empty images
        default: ''
    },
    subcategories: [{ // Changed from sub_category to subcategories
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);