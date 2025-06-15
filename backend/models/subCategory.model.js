const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    subcategory_name: {
        type: String,
        required: true
    },
    subcategory_image: {
        type: String,
        required: false,
        default: ''
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('SubCategory', subCategorySchema);