const AuthService = require('./auth.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const authService = new AuthService();

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 'Usuario registrado correctamente', 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result, 'Inicio de sesión exitoso');
});

const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const result = await authService.logout(token);
  sendSuccess(res, result, 'Sesión cerrada correctamente');
});

module.exports = {
  register,
  login,
  logout,
};
