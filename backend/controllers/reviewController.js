const Review = require('../models/Review.js');
const Order = require('../models/Order.js');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private/Doctor
const createReview = async (req, res) => {
    const { orderId, reviewValue, comment } = req.body;
    const doctorId = req.user._id;

    try {
        const order = await Order.findById(orderId);
        if (!order || order.doctor.toString() !== doctorId.toString()) {
            return res.status(401).json({ message: 'Order not found or not authorized.' });
        }
        if (order.status !== 'Finished') {
            return res.status(400).json({ message: 'You can only review finished orders.' });
        }
        const existingReview = await Review.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({ message: 'This order has already been reviewed.' });
        }
        const newReview = await Review.create({
            doctor: doctorId,
            lab: order.lab,
            case: order.case,
            order: orderId,
            reviewValue,
            comment,
        });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createReview,
};
