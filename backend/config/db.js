const mongoose = require('mongoose');

require('../models/Doctor.js');
require('../models/Patient.js');
require('../models/Case.js');
require('../models/Lab.js');
require('../models/Order.js');
require('../models/Category.js');
require('../models/Review.js');


// دالة للاتصال بقاعدة البيانات
const connectDB = async () => {
    try {
        // محاولة الاتصال بقاعدة البيانات باستخدام رابط الاتصال
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });

        // طباعة رسالة نجاح الاتصال مع عرض اسم المضيف (host)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // في حال فشل الاتصال، اطبع الخطأ وأنهِ العملية
        console.error(`Error: ${error.message}`);
        process.exit(1); // إنهاء العملية مع رمز فشل
    }
};

module.exports = connectDB;
