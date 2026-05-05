const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Generar token JWT
 * @param {string} userId - ID del usuario
 * @returns {string} Token JWT
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Registrar un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Object} Usuario creado y token
 */
const register = async (userData) => {
  const { email, password, firstName, lastName, studentId, role } = userData;

  // Verificar si el email ya existe
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    const error = new Error('El correo electrónico ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  // Verificar si el studentId ya existe
  const existingStudentId = await User.findOne({ studentId });
  if (existingStudentId) {
    const error = new Error('El ID de estudiante ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  // Crear usuario
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    studentId,
    role: role || 'student'
  });

  const token = generateToken(user._id);

  logger.info(`Usuario registrado: ${user.email} (${user.studentId})`);

  return {
    user: user.toPublicJSON(),
    token
  };
};

/**
 * Iniciar sesión
 * @param {string} email - Correo electrónico
 * @param {string} password - Contraseña
 * @returns {Object} Usuario y token
 */
const login = async (email, password) => {
  // Buscar usuario incluyendo contraseña
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Cuenta desactivada. Contacta al administrador.');
    error.statusCode = 401;
    throw error;
  }

  // Verificar contraseña
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Actualizar último login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  logger.info(`Usuario autenticado: ${user.email}`);

  return {
    user: user.toPublicJSON(),
    token
  };
};

/**
 * Obtener perfil del usuario actual
 * @param {string} userId - ID del usuario
 * @returns {Object} Datos del usuario
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user.toPublicJSON();
};

/**
 * Cambiar contraseña
 * @param {string} userId - ID del usuario
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    const error = new Error('Contraseña actual incorrecta');
    error.statusCode = 401;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Contraseña cambiada para usuario: ${user.email}`);

  return { message: 'Contraseña actualizada exitosamente' };
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  generateToken
};
