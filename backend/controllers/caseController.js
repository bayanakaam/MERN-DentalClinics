// controllers/caseController.js

const Case = require('../models/Case.js');
const Doctor = require('../models/Doctor.js');

const createCase = async (req, res) => {
    try {
        const { patientId, treatments, generalComment } = req.body;

        // 1. التحقق من وجود الملف (هذا جيد)
        if (!req.file) {
            return res.status(400).json({ message: 'Case file is required.' });
        }
        
        // 2. التحقق من وجود patientId
        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required.' });
        }

        const caseFilePath = req.file.path;

        // --- هذا هو الجزء الذي سنقوم بتعديله ---
        let parsedTreatments = []; // القيمة الافتراضية هي مصفوفة فارغة
        
        // فقط حاول تحليل 'treatments' إذا كانت موجودة
        if (treatments) {
            try {
                parsedTreatments = JSON.parse(treatments);
            } catch (e) {
                return res.status(400).json({ message: 'Invalid format for treatments data.' });
            }
        }
        // --- نهاية التعديل ---

        // إنشاء الحالة الجديدة
        const newCase = await Case.create({
            doctor: req.user._id,
            patient: patientId,
            caseFile: caseFilePath,
            treatments: parsedTreatments, // استخدم القيمة المحللة أو المصفوفة الفارغة
            generalComment
        });

        res.status(201).json(newCase);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getDoctorCases = async (req, res) => {
    try {
        // 1. البحث عن الحالات التي يطابق فيها حقل 'doctor'
        //    معرّف الطبيب المسجل دخوله (req.user._id)
        const cases = await Case.find({ doctor: req.user._id })
                                .populate('patient', 'fullName fileNumber') // لجلب اسم المريض ورقم ملفه
                                .sort({ createdAt: -1 }); // لترتيب الحالات من الأحدث إلى الأقدم

        // 2. إرسال الحالات كاستجابة
        res.status(200).json(cases);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    createCase,
    getDoctorCases,
};
