const express = require('express');
const router = express.Router();

// --- 1. استيراد الـ Middleware الجديد والصحيح ---
const { protect, doctor } = require('../middleware/authMiddleware.js');

// --- 2. استيراد دوال الـ Controller (سنفترض أن اسمها getMyPatients) ---
const { createPatient, getMyPatients } = require('../controllers/patientController.js');

// @route   GET /api/patients
// @desc    Get all patients for the logged-in doctor
// @access  Private/Doctor
router.route('/').get(protect, doctor, getMyPatients);

// @route   POST /api/patients
// @desc    Create a new patient
// @access  Private/Doctor
router.route('/').post(protect, doctor, createPatient);

module.exports = router;
