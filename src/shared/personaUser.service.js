const AppError = require('./errors/AppError');
const UserRepository = require('../modules/users/user.repository');
const RoleRepository = require('../modules/roles/role.repository');
const { hashPassword } = require('../utils/password');

class PersonaUserService {
  constructor(userRepository = new UserRepository(), roleRepository = new RoleRepository()) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async createLinkedUser({ username, email, password, roleName }, trx) {
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError('El email ya está registrado', 409);
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new AppError('El username ya está registrado', 409);
    }

    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new AppError(`El rol ${roleName} no está configurado`, 500);
    }

    const passwordHash = await hashPassword(password);
    const [user] = await this.userRepository.create(
      {
        username,
        email,
        password_hash: passwordHash,
        is_active: true,
      },
      trx,
    );

    await this.roleRepository.assignRoleToUser(user.id, role.id, trx);

    return user;
  }

  async deactivateLinkedUser(userId, deactivatedBy, trx) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.is_active) {
      return null;
    }

    const [deactivated] = await this.userRepository.deactivate(userId, deactivatedBy, trx);
    return deactivated;
  }
}

module.exports = PersonaUserService;
