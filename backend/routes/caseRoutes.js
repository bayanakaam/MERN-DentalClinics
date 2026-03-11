const express = require('express');
const router = express.Router();

// --- 1. استيراد الـ Middleware الجديد والصحيح ---
const { protect, doctor } = require('../middleware/authMiddleware.js');

// --- 2. استيراد دوال الـ Controller (وهي صحيحة كما أرسلتها) ---
const { createCase, getDoctorCases } = require('../controllers/caseController.js');

// --- 3. استيراد إعدادات multer ---
const upload = require('../config/uploadConfig.js');

// @route   GET /api/cases
// @desc    Get all cases for the logged-in doctor
// @access  Private/Doctor
router.route('/').get(protect, doctor, getDoctorCases);

// @route   POST /api/cases
// @desc    Create a new case
// @access  Private/Doctor
router.route('/').post(
    protect,                      // أولاً: تحقق من وجود توكن صالح وجلب المستخدم
    doctor,                       // ثانياً: تأكد من أن المستخدم هو طبيب
    upload.single('caseFile'),    // ثالثاً: عالج رفع الملف
    createCase                    // رابعاً: نفذ دالة إنشاء الحالة
);

module.exports = router;
