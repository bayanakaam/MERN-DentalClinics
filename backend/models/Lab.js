const mongoose = require('mongoose');
const { Schema } = mongoose;

const labSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Lab name is required.'],
    default: 'N/A' 
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
     balance: { // الرصيد المالي
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Lab = mongoose.model('Lab', labSchema);
module.exports = Lab;
