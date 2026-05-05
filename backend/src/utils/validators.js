const { body, param, query } = require('express-validator');

// Validadores de Autenticación
const authValidators = {
  register: [
    body('email')
      .isEmail().withMessage('El correo electrónico no es válido')
      .normalizeEmail()
      .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres'),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
      .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
      .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe contener al menos un carácter especial'),
    body('firstName')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('El apellido es requerido')
      .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
    body('studentId')
      .trim()
      .notEmpty().withMessage('El ID de estudiante es requerido')
      .isLength({ min: 5, max: 20 }).withMessage('El ID de estudiante debe tener entre 5 y 20 caracteres')
      .matches(/^[a-zA-Z0-9-]+$/).withMessage('El ID de estudiante solo puede contener letras, números y guiones'),
    body('role')
      .optional()
      .isIn(['student', 'admin', 'support']).withMessage('Rol no válido')
  ],
  login: [
    body('email')
      .isEmail().withMessage('El correo electrónico no es válido')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es requerida')
  ]
};

// Validadores de Tickets
const ticketValidators = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('El título es requerido')
      .isLength({ min: 5, max: 200 }).withMessage('El título debe tener entre 5 y 200 caracteres'),
    body('description')
      .trim()
      .notEmpty().withMessage('La descripción es requerida')
      .isLength({ min: 10, max: 5000 }).withMessage('La descripción debe tener entre 10 y 5000 caracteres'),
    body('category')
      .trim()
      .notEmpty().withMessage('La categoría es requerida')
      .isMongoId().withMessage('La categoría debe ser un ID válido'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Prioridad no válida')
  ],
  update: [
    param('id')
      .isMongoId().withMessage('ID de ticket no válido'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 }).withMessage('El título debe tener entre 5 y 200 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 }).withMessage('La descripción debe tener entre 10 y 5000 caracteres'),
    body('status')
      .optional()
      .isIn(['open', 'in_progress', 'resolved', 'closed', 'reopened']).withMessage('Estado no válido'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Prioridad no válida')
  ],
  getById: [
    param('id')
      .isMongoId().withMessage('ID de ticket no válido')
  ],
  list: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
    query('status')
      .optional()
      .isIn(['open', 'in_progress', 'resolved', 'closed', 'reopened']).withMessage('Estado no válido'),
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Prioridad no válida'),
    query('category')
      .optional()
      .isMongoId().withMessage('ID de categoría no válido')
  ]
};

// Validadores de Comentarios
const commentValidators = {
  create: [
    param('ticketId')
      .isMongoId().withMessage('ID de ticket no válido'),
    body('content')
      .trim()
      .notEmpty().withMessage('El contenido es requerido')
      .isLength({ min: 1, max: 2000 }).withMessage('El comentario debe tener entre 1 y 2000 caracteres')
  ]
};

// Validadores de Usuarios
const userValidators = {
  update: [
    param('id')
      .isMongoId().withMessage('ID de usuario no válido'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
    body('role')
      .optional()
      .isIn(['student', 'admin', 'support']).withMessage('Rol no válido')
  ]
};

// Validadores de Categorías
const categoryValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres')
  ],
  update: [
    param('id')
      .isMongoId().withMessage('ID de categoría no válido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres')
  ]
};

module.exports = {
  authValidators,
  ticketValidators,
  commentValidators,
  userValidators,
  categoryValidators
};
