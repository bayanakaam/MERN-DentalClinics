const express = require('express');
const router = express.Router();
const { getDoctorCalendar } = require('../controllers/calendarController.js');
const { protect, doctor } = require('../middleware/authMiddleware.js');

// مسار لجلب أحداث التقويم للطبيب
// GET /api/calendar
router.route('/').get(protect, doctor, getDoctorCalendar);

module.exports = router;
