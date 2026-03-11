const express = require('express');
const router = express.Router();
const { getAllLabs } = require('../controllers/labController.js');
const { protect, doctor } = require('../middleware/authMiddleware.js');

// مسار لجلب قائمة المختبرات (متاح للأطباء لاختيار مختبر عند إنشاء طلب)
// GET /api/labs
router.route('/').get(protect, doctor, getAllLabs);

module.exports = router;
