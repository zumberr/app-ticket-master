const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { register, login, getProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authValidators } = require('../utils/validators');

// Rutas públicas
router.post('/register', authValidators.register, validate, register);
// Login has a stricter limiter to reduce credential-stuffing risk.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos de inicio de sesión. Intenta más tarde.' }
});

router.post('/login', loginLimiter, authValidators.login, validate, login);

// Rutas protegidas
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, authValidators.changePassword, validate, changePassword);

module.exports = router;
