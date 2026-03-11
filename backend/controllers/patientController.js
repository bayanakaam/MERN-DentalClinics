// controllers/patientController.js

const Patient = require('../models/Patient.js');

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private (e.g., Doctor)
const createPatient = async (req, res) => {
    try {
        const { fileNumber, fullName, age, gender, phoneNumber } = req.body;

        // التحقق من البيانات الأساسية
        if (!fileNumber || !fullName || !age || !gender || !phoneNumber) {
            return res.status(400).json({ message: 'Please provide all required patient fields' });
        }

        // التحقق من أن رقم الملف فريد
        const patientExists = await Patient.findOne({ fileNumber });
        if (patientExists) {
            return res.status(400).json({ message: `Patient with file number ${fileNumber} already exists` });
        }

        const newPatient = await Patient.create({
            fileNumber,
            fullName,
            age,
            gender,
            phoneNumber
        });

        res.status(201).json(newPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (e.g., Doctor)
const getMyPatients = async (req, res) => {
    try {
        const patients = await Patient.find({});
        res.status(200).json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createPatient,
    getMyPatients,
};
