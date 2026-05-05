const { userService } = require('../services');

/**
 * GET /api/v1/users
 * Obtener lista de usuarios
 */
const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query, req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/users/:id
 * Obtener usuario por ID
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/users/:id
 * Actualizar usuario
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/users/:id/toggle-status
 * Activar/desactivar usuario
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const result = await userService.toggleUserStatus(req.params.id, req.body.isActive);
    res.status(200).json({
      success: true,
      message: result.message,
      data: { user: result.user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/users/:id/stats
 * Obtener estadísticas del usuario
 */
const getUserStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats(req.params.id);
    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  getUserStats
};
