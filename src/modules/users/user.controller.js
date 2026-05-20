const UserService = require('./user.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const userService = new UserService();

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  sendSuccess(res, users, 'Usuarios obtenidos correctamente');
});

module.exports = {
  getUsers,
};
