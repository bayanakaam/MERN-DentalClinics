const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    case: {
        type: Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    doctor: { // نضيف مرجعاً للطبيب لتسهيل الاستعلامات
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    lab: {
        type: Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Denied', 'In Progress', 'Finished'],
        default: 'Pending'
    },
    deliveryDate: { // يحدده المختبر عند قبول الطلب
        type: Date
    }
}, { timestamps: true });

// إضافة فهرس (index) لتحسين أداء البحث والفرز حسب الحالة
orderSchema.index({ lab: 1, status: 1 });
orderSchema.index({ doctor: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
