const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController.js');

// مسار تسجيل الدخول الموحد
// POST /api/auth/login
router.post('/login', login);

// مسار التسجيل الموحد
// POST /api/auth/register
router.post('/register', register);

module.exports = router;
