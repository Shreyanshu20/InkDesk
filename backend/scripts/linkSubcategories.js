const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

async function linkSubcategories() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Get all categories and subcategories
    const categories = await Category.find();
    const subcategories = await SubCategory.find();

    console.log(`📋 Found ${categories.length} categories and ${subcategories.length} subcategories`);

    // Link subcategories to their parent categories
    for (const category of categories) {
      console.log(`\n🔗 Processing category: ${category.category_name}`);
      
      // Find subcategories that belong to this category
      const relatedSubcategories = subcategories.filter(sub => 
        sub.category_id.toString() === category._id.toString()
      );
      
      if (relatedSubcategories.length > 0) {
        console.log(`   Found ${relatedSubcategories.length} subcategories:`);
        relatedSubcategories.forEach(sub => {
          console.log(`   - ${sub.subcategory_name}`);
        });
        
        // Update category with subcategory IDs
        category.subcategories = relatedSubcategories.map(sub => sub._id);
        await category.save();
        
        console.log(`   ✅ Linked ${relatedSubcategories.length} subcategories to ${category.category_name}`);
      } else {
        console.log(`   ❌ No subcategories found for ${category.category_name}`);
      }
    }

    console.log('\n🎉 All subcategories linked successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error linking subcategories:', error);
    process.exit(1);
  }
}

linkSubcategories();