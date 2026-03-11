const Lab = require('../models/Lab.js');

// @desc    Get all labs
// @route   GET /api/labs
// @access  Private/Doctor
const getAllLabs = async (req, res) => {
    try {
        // جلب جميع المختبرات واختيار الاسم والمعرف فقط
        const labs = await Lab.find({}).select('_id name');
        res.status(200).json(labs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllLabs,
};
