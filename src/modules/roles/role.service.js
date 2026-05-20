const RoleRepository = require('./role.repository');

class RoleService {
  constructor(roleRepository = new RoleRepository()) {
    this.roleRepository = roleRepository;
  }

  getAllRoles() {
    return this.roleRepository.findAll();
  }

  getUserRoles(userId) {
    return this.roleRepository.findRolesByUserId(userId);
  }
}

module.exports = RoleService;
