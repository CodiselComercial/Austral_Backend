const AppError = require('../shared/errors/AppError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Registro duplicado',
      details: err.detail,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
};

module.exports = errorHandler;
