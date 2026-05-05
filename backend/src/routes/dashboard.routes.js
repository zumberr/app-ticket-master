const express = require('express');
const router = express.Router();

const { getStats } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'support'));
router.get('/stats', getStats);

module.exports = router;
