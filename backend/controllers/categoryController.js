// controllers/categoryController.js

const Category = require('../models/Category.js');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (for now, Doctor)
const createCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;

        if (!name || !subCategories || subCategories.length === 0) {
            return res.status(400).json({ message: 'Category name and subcategories are required' });
        }

        const newCategory = await Category.create({ name, subCategories });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private (e.g., Doctor)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
};
