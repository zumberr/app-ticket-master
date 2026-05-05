const { categoryService } = require('../services');

/**
 * POST /api/v1/categories
 * Crear una nueva categoría
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/categories
 * Obtener todas las categorías
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/categories/:id
 * Obtener categoría por ID
 */
const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json({
      success: true,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/categories/:id
 * Actualizar categoría
 */
const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/categories/:id
 * Eliminar categoría (desactivar)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
