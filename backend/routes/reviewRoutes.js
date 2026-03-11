const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController.js');
const { protect, doctor } = require('../middleware/authMiddleware.js');

// مسار لإنشاء تقييم جديد (محمي، للطبيب فقط)
// POST /api/reviews
router.route('/').post(protect, doctor, createReview);

module.exports = router;
