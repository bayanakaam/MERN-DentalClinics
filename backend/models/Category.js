const mongoose = require('mongoose');
const { Schema } = mongoose;

// نموذج للفئة الفرعية
const subCategorySchema = new Schema({
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#808080' }
});

// نموذج للفئة الرئيسية
const categorySchema = new Schema({
    name: { // مثل "Crowns and copings"
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subCategories: [subCategorySchema] // مصفوفة من الفئات الفرعية
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
