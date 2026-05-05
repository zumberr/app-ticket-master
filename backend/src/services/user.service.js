const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const logger = require('../utils/logger');

/**
 * Obtener lista de usuarios con filtros y paginación
 * @param {Object} filters - Filtros de búsqueda
 * @param {Object} pagination - Opciones de paginación
 * @returns {Object} Lista de usuarios y metadatos
 */
const getUsers = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, search, role, isActive } = pagination;
  const skip = (page - 1) * limit;

  const query = {};

  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true' || isActive === true;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query)
  ]);

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Obtener usuario por ID
 * @param {string} userId - ID del usuario
 * @returns {Object} Datos del usuario
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Actualizar usuario
 * @param {string} userId - ID del usuario
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} Usuario actualizado
 */
const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Prevenir cambio de email a uno existente
  if (updateData.email && updateData.email !== user.email) {
    const existingEmail = await User.findOne({ email: updateData.email });
    if (existingEmail) {
      const error = new Error('El correo electrónico ya está registrado');
      error.statusCode = 409;
      throw error;
    }
  }

  // Prevenir cambio de studentId a uno existente
  if (updateData.studentId && updateData.studentId !== user.studentId) {
    const existingId = await User.findOne({ studentId: updateData.studentId });
    if (existingId) {
      const error = new Error('El ID de estudiante ya está registrado');
      error.statusCode = 409;
      throw error;
    }
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      user[key] = updateData[key];
    }
  });

  await user.save();

  logger.info(`Usuario actualizado: ${user.email}`);

  return user.toPublicJSON();
};

/**
 * Desactivar/activar usuario
 * @param {string} userId - ID del usuario
 * @param {boolean} isActive - Estado deseado
 * @returns {Object} Usuario actualizado
 */
const toggleUserStatus = async (userId, isActive) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  user.isActive = isActive;
  await user.save();

  const action = isActive ? 'activado' : 'desactivado';
  logger.info(`Usuario ${action}: ${user.email}`);

  return {
    user: user.toPublicJSON(),
    message: `Usuario ${action} exitosamente`
  };
};

/**
 * Obtener estadísticas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} Estadísticas
 */
const getUserStats = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const stats = await Ticket.aggregate([
    { $match: { createdBy: new require('mongoose').Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusCounts = {
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    reopened: 0
  };

  stats.forEach(stat => {
    statusCounts[stat._id] = stat.count;
  });

  const totalTickets = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return {
    userId,
    totalTickets,
    byStatus: statusCounts,
    openTickets: statusCounts.open + statusCounts.in_progress + statusCounts.reopened,
    resolvedTickets: statusCounts.resolved + statusCounts.closed
  };
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  getUserStats
};
