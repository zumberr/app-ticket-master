const { validationResult } = require('express-validator');

/**
 * Middleware para validar los resultados de express-validator
 * Si hay errores, retorna 400 con los mensajes de error
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

module.exports = validate;
