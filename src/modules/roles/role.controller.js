const RoleService = require('./role.service');
const { sendSuccess } = require('../../shared/responses/apiResponse');
const asyncHandler = require('../../shared/asyncHandler');

const roleService = new RoleService();

const getRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.getAllRoles();
  sendSuccess(res, roles, 'Roles obtenidos correctamente');
});

module.exports = {
  getRoles,
};
