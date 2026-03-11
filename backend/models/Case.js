const mongoose = require('mongoose');
const { Schema } = mongoose;

// أولاً: نُعرّف "مخططاً فرعياً" لكل علاج مطلوب
const treatmentSchema = new Schema({
    toothId: { type: Number, required: true },
    category: { // الفئة الرئيسية مثل "Crowns and copings"
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: { // الفئة الفرعية مثل "Anatomic crown"
        // هذا الـ ObjectId سيشير إلى عنصر داخل مصفوفة subCategories في نموذج Category
        type: Schema.Types.ObjectId,
        required: true
    },
    // يمكن إضافة ملاحظات خاصة بهذا السن تحديداً
    notes: { type: String, trim: true }
}, { _id: true }); // _id: true مهم لتمييز كل علاج عن الآخر داخل الحالة

// ثانياً: نستخدم المخطط الفرعي داخل نموذج الحالة الرئيسي
const caseSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    caseFile: { // ملف STL/PLY واحد يجمع كل هذه العلاجات
        type: String,
        required: true
    },
    // هنا التغيير الجوهري: مصفوفة من العلاجات
    treatments: {
        type: [treatmentSchema],
        required: true, 
        validate: [(val) => val.length > 0, 'At least one treatment is required.']
    },
    generalComment: { // ملاحظات عامة على الحالة ككل
        type: String,
        trim: true
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length > 0;
}

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
