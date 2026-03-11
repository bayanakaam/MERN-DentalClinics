const Order = require('../models/Order.js');
const Case = require('../models/Case.js');

const createOrder = async (req, res) => {
    const { caseId, labId } = req.body;
    try {
        const caseToOrder = await Case.findById(caseId);
        if (!caseToOrder || caseToOrder.doctor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Case not found or not authorized' });
        }
        const existingOrder = await Order.findOne({ case: caseId });
        if (existingOrder) {
            return res.status(400).json({ message: 'This case has already been ordered' });
        }
        const newOrder = await Order.create({ case: caseId, doctor: req.user._id, lab: labId });
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getMyDoctorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ doctor: req.user._id })
            .populate('lab', 'name')
            .populate({ path: 'case', select: 'patient', populate: { path: 'patient', select: 'fullName' } })
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getLabOrders = async (req, res) => {
    try {
        const orders = await Order.find({ lab: req.user._id })
            .populate({ path: 'case', select: 'caseFile patient', populate: { path: 'patient', select: 'fullName' } })
            .populate('doctor', 'fullName clinicName')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    let { status, deliveryDate } = req.body;
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order || order.lab.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Order not found or not authorized.' });
        }
        // ... (باقي منطق تحديث الحالة)
        order.status = status;
        if (status === 'Accepted') {
            order.deliveryDate = deliveryDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
        }
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyDoctorOrders,
    getLabOrders,
    updateOrderStatus,
};
