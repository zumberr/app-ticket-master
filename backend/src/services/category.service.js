const Category = require('../models/category.model');
const logger = require('../utils/logger');

/**
 * Crear una nueva categoría
 * @param {Object} categoryData - Datos de la categoría
 * @returns {Object} Categoría creada
 */
const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);
  logger.info(`Categoría creada: ${category.name}`);
  return category;
};

/**
 * Obtener todas las categorías activas
 * @returns {Array} Lista de categorías
 */
const getCategories = async () => {
  return await Category.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 });
};

/**
 * Obtener categoría por ID
 * @param {string} categoryId - ID de la categoría
 * @returns {Object} Categoría
 */
const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error('Categoría no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

/**
 * Actualizar categoría
 * @param {string} categoryId - ID de la categoría
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} Categoría actualizada
 */
const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error('Categoría no encontrada');
    error.statusCode = 404;
    throw error;
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      category[key] = updateData[key];
    }
  });

  await category.save();

  logger.info(`Categoría actualizada: ${category.name}`);
  return category;
};

/**
 * Eliminar (desactivar) categoría
 * @param {string} categoryId - ID de la categoría
 * @returns {Object} Mensaje de confirmación
 */
const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error('Categoría no encontrada');
    error.statusCode = 404;
    throw error;
  }

  category.isActive = false;
  await category.save();

  logger.info(`Categoría desactivada: ${category.name}`);
  return { message: 'Categoría desactivada exitosamente' };
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
