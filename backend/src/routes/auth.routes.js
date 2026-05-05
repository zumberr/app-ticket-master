const express = require('express');
const router = express.Router();

const { register, login, getProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authValidators } = require('../utils/validators');

// Rutas públicas
router.post('/register', authValidators.register, validate, register);
router.post('/login', authValidators.login, validate, login);

// Rutas protegidas
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
