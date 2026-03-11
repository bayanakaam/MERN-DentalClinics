const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor.js');
const Lab = require('../models/Lab.js');

// --- 1. دالة الحماية الموحدة ---
// وظيفتها: التحقق من التوكن وجلب المستخدم (طبيب أو مختبر)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ابحث في النموذجين عن المستخدم
            req.user = await Doctor.findById(decoded.id).select('-password') || await Lab.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // انتقل إلى الـ middleware التالي
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- 2. دوال التحقق من الدور ---
// وظيفتها: التحقق من دور المستخدم الذي تم جلبه بواسطة 'protect'

const doctor = (req, res, next) => {
    // req.user.constructor.modelName ستكون 'Doctor' أو 'Lab'
    if (req.user && req.user.constructor.modelName === 'Doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access restricted to Doctors' });
    }
};

const lab = (req, res, next) => {
    if (req.user && req.user.constructor.modelName === 'Lab') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access restricted to Labs' });
    }
};

// --- 3. تصدير الدوال الثلاثة ---
module.exports = { protect, doctor, lab };
