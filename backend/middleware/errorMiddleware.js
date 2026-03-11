// middleware/errorMiddleware.js
const { MulterError } = require('multer');


const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // تمرير الخطأ إلى معالج الأخطاء التالي
};


const errorHandler = (err, req, res, next) => {
    // التحقق مما إذا كان الخطأ قادماً من multer
    if (err instanceof MulterError) {
        // أخطاء معروفة من multer
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 50MB.' });
        }
        // يمكنك إضافة المزيد من حالات الخطأ هنا
    }

    // التحقق من الخطأ المخصص الذي أنشأناه في fileFilter
    if (err.message === 'Invalid file type, only STL and PLY are allowed!') {
        return res.status(400).json({ message: err.message });
    }

    // لأي أخطاء أخرى، أرسل استجابة خطأ عامة
    console.error(err.stack); // لطباعة الخطأ الكامل في الطرفية للمطور
    res.status(500).json({
        message: 'Something went wrong on the server!',
        // لا ترسل تفاصيل الخطأ للعميل في بيئة الإنتاج
        error: process.env.NODE_ENV === 'production' ? null : err.message,
    });
};




module.exports = {notFound,  errorHandler };
