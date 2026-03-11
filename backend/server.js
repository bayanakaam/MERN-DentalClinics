const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // <-- مهم لخدمة الملفات الثابتة
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// --- تهيئة أولية ---
dotenv.config();
connectDB();
const app = express();

// --- Middlewares أساسية ---
app.use(cors()); // السماح بالطلبات من مصادر مختلفة
app.use(express.json()); // للسماح باستقبال بيانات JSON
app.use(express.urlencoded({ extended: true })); // للسماح باستقبال بيانات Form

// --- المسارات الرئيسية للـ API ---
// كل مسار يبدأ بـ /api/[اسم المورد]
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/labs', require('./routes/labRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes')); // <-- المسار الجديد للتقويم

// --- خدمة الملفات المرفوعة (مثل صور STL/PLY) ---
// هذا السطر يجعل مجلد 'uploads' متاحاً بشكل عام
// مثال: http://localhost:5000/uploads/casefile-123.stl
app.use('/uploads', express.static(path.join(__dirname, '/uploads' )));

// --- Middlewares معالجة الأخطاء (يجب أن تكون في النهاية) ---
app.use(notFound);
app.use(errorHandler);

// --- تشغيل الخادم ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
