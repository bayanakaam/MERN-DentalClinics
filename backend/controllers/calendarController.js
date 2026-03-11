// controllers/calendarController.js

const Order = require('../models/Order.js');

// @desc    Get calendar events for the logged-in doctor
// @route   GET /api/calendar/doctor
// @access  Private/Doctor
const getDoctorCalendar = async (req, res) => {
    try {
        // 1. تحديث populate لجلب fileNumber أيضاً
        const orders = await Order.find({
            doctor: req.user._id,
            deliveryDate: { $exists: true },
            status: { $in: ['Accepted', 'In Progress'] }
        }).populate({
            path: 'case',
            select: 'patient',
            populate: {
                path: 'patient',
                select: 'fullName fileNumber' // <--- التعديل هنا: جلب رقم الملف
            }
        });

        const events = orders
            .filter(order => order.case && order.case.patient) // التحقق من وجود البيانات
            .map(order => {
                const patient = order.case.patient;
                const patientName = patient.fullName || 'Unknown Patient';
                const patientFileNumber = patient.fileNumber ? `(${patient.fileNumber})` : ''; // إضافة رقم الملف بين قوسين إذا كان موجوداً

                // 2. بناء الكائن الجديد مع كل المعلومات المطلوبة
                return {
                    id: order._id,
                    title: `Delivery: ${patientName} ${patientFileNumber}`, // <--- التعديل هنا: العنوان الجديد
                    start: order.deliveryDate, // تاريخ التسليم (بداية الحدث)
                    end: order.deliveryDate,   // نهاية الحدث
                    allDay: true,
                    status: order.status,
                    orderDate: order.createdAt // <--- التعديل هنا: إضافة تاريخ إنشاء الطلب
                };
            });

        res.status(200).json(events);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDoctorCalendar,
};
