const express = require('express');
const router = express.Router();

// استيراد الـ Middleware المصحح
const { protect, doctor, lab } = require('../middleware/authMiddleware.js');

// استيراد دوال الـ Controller
const {
    createOrder,
    getMyDoctorOrders,
    getLabOrders,
    updateOrderStatus
} = require('../controllers/orderController.js');

// مسار إنشاء طلب (محمي، للطبيب فقط)
router.route('/').post(protect, doctor, createOrder);

// مسار جلب طلبات الطبيب (محمي، للطبيب فقط)
router.route('/my-doctor-orders').get(protect, doctor, getMyDoctorOrders);

// مسار جلب طلبات المختبر (محمي، للمختبر فقط)
router.route('/lab-orders').get(protect, lab, getLabOrders);

// مسار تحديث حالة الطلب (محمي، للمختبر فقط)
router.route('/:orderId/status').put(protect, lab, updateOrderStatus);

module.exports = router;
