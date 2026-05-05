const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categoryValidators } = require('../utils/validators');

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Solo admin puede crear, editar o eliminar categorías
router.use(protect, authorize('admin'));
router.post('/', categoryValidators.create, validate, createCategory);
router.put('/:id', categoryValidators.update, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
