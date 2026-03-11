// config/uploadConfig.js

const multer = require('multer');
const path = require('path');

// 1. إعداد التخزين (Storage Engine)
const storage = multer.diskStorage({
    // destination: أين سيتم حفظ الملفات
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // المجلد الذي أنشأناه
    },
    // filename: كيف سيتم تسمية الملف
    filename: function (req, file, cb) {
        // إنشاء اسم فريد للملف لتجنب التضارب
        // الاسم سيكون: casefile-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'casefile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. إعداد فلتر الملفات (File Filter)
const fileFilter = (req, file, cb) => {
    // التحقق من امتداد الملف (MIME type)
    if (file.mimetype === 'application/octet-stream' || file.originalname.toLowerCase().endsWith('.stl') || file.originalname.toLowerCase().endsWith('.ply')) {
        // السماح بالملف
        cb(null, true);
    } else {
        // رفض الملف
        cb(new Error('Invalid file type, only STL and PLY are allowed!'), false);
    }
};

// 3. إنشاء وسيط multer مع الإعدادات
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 // تحديد حجم أقصى للملف (هنا 50 ميجابايت)
    },
    fileFilter: fileFilter
});

module.exports = upload;
