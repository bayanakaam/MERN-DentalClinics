const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    clinicName: {
        type: String,
        required: [true, 'Clinic name is required.'],
    default: 'N/A'
    },
    email: {
        type: String,
        required: true,
        unique: true, // البريد الإلكتروني يجب أن يكون فريداً
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true }); // لإضافة حقلي createdAt و updatedAt تلقائياً

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
