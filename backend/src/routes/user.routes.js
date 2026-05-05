const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  getUserStats
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidators } = require('../utils/validators');

router.use(protect);

// Rutas accesibles por admin
router.get('/', authorize('admin'), getUsers);
router.get('/:id/stats', getUserStats);
router.put('/:id', userValidators.update, validate, updateUser);
router.post('/:id/toggle-status', authorize('admin'), toggleUserStatus);
router.get('/:id', getUserById);

module.exports = router;
