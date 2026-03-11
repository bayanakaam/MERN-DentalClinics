const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories } = require('../controllers/categoryController.js');
const { protect, doctor } = require('../middleware/authMiddleware.js');

// مسار جلب جميع الفئات (متاح للأطباء)
// GET /api/categories
router.route('/').get(protect, doctor, getAllCategories);

// مسار إنشاء فئة جديدة (يمكن حمايته لمسؤول النظام لاحقاً، لكننا سنتركه للطبيب الآن)
// POST /api/categories
router.route('/').post(protect, doctor, createCategory);

module.exports = router;
