// models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Lab'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
        unique: true 
    },
    case: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Case'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
