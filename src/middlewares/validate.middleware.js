const AppError = require('../shared/errors/AppError');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new AppError('Datos de entrada inválidos', 400, details));
  }

  req.body = value;
  return next();
};

module.exports = validate;
