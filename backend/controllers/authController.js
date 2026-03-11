const Doctor = require('../models/Doctor.js');
const Lab = require('../models/Lab.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// دالة مساعدة لإنشاء التوكن
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ====================================================================
//  دالة تسجيل الدخول الموحدة
// ====================================================================
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // ابحث في النموذجين عن المستخدم
        // .select('+password') ضروري لأننا قمنا بإخفاء كلمة المرور في النموذج
        let user = await Doctor.findOne({ email }).select('+password') || await Lab.findOne({ email }).select('+password');

        // التحقق من وجود المستخدم ومقارنة كلمة المرور
        if (user && (await bcrypt.compare(password, user.password))) {
            
            // تحديد الدور بناءً على النموذج الذي تم العثور على المستخدم فيه
            const role = user.constructor.modelName; // ستكون 'Doctor' أو 'Lab'

            // بناء كائن المستخدم للإرسال (بدون كلمة المرور)
            const userPayload = {
                _id: user._id,
                fullName: user.fullName || user.name, // استخدم fullName للطبيب أو name للمختبر
                email: user.email,
                role: role
            };

            // إرسال استجابة ناجحة مع التوكن وبيانات المستخدم
            res.status(200).json({
                message: 'Login successful',
                token: generateToken(user._id, role),
                user: userPayload
            });

        } else {
            // رسالة خطأ عامة لأسباب أمنية
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Something went wrong on the server!' });
    }
};

// ====================================================================
//  دالة التسجيل الموحدة
// ====================================================================
const register = async (req, res) => {
    // استقبال كل الحقول الممكنة من الواجهة الأمامية
    const { role, fullName, email, password, phoneNumber, address, clinicName } = req.body;

    // التحقق من الحقول الأساسية
    if (!role || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: 'Role, email, password, and phone number are required.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let newUser;

        if (role === 'Doctor') {
            // التحقق من الحقول الخاصة بالطبيب
            if (!fullName || !clinicName) {
                return res.status(400).json({ message: 'Full name and clinic name are required for doctors.' });
            }
            // التحقق من عدم وجود طبيب بنفس البريد الإلكتروني
            const doctorExists = await Doctor.findOne({ email });
            if (doctorExists) {
                return res.status(400).json({ message: 'A doctor with this email already exists.' });
            }
            // إنشاء الطبيب الجديد
            newUser = await Doctor.create({ fullName, clinicName, email, phoneNumber, password: hashedPassword, address });
        
        } else if (role === 'Lab') {
            // التحقق من الحقول الخاصة بالمختبر
            if (!fullName) {
                return res.status(400).json({ message: 'Full name (as lab name) is required for labs.' });
            }
            // التحقق من عدم وجود مختبر بنفس البريد الإلكتروني
            const labExists = await Lab.findOne({ email });
            if (labExists) {
                return res.status(400).json({ message: 'A lab with this email already exists.' });
            }
            // إنشاء المختبر الجديد (استخدام fullName كـ name)
            newUser = await Lab.create({ name: fullName, email, phoneNumber, password: hashedPassword, address });
        
        } else {
            return res.status(400).json({ message: 'Invalid role specified. Must be "Doctor" or "Lab".' });
        }

        // إرسال استجابة ناجحة
        if (newUser) {
            res.status(201).json({ message: `${role} registered successfully. Please log in.` });
        } else {
            // هذه الحالة نادرة ولكنها احتياطية
            res.status(400).json({ message: 'Invalid user data provided.' });
        }
    } catch (error) {
        // معالجة أخطاء Mongoose (مثل البريد الإلكتروني المكرر)
        if (error.code === 11000) {
            return res.status(400).json({ message: `An account with this email or phone number already exists.` });
        }
        console.error(`Register ${role} Error:`, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- تصدير الدوال الموحدة ---
module.exports = {
    login,
    register,
};
