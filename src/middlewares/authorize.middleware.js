const AppError = require('../shared/errors/AppError');

const authorize = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('No autenticado', 401));
  }

  const userRoles = req.user.roles || [];
  const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasPermission) {
    return next(new AppError('No tienes permisos para realizar esta acción', 403));
  }

  return next();
};

module.exports = authorize;
