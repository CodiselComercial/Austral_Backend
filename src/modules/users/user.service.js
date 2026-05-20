const AppError = require('../../shared/errors/AppError');
const UserRepository = require('./user.repository');
const RoleRepository = require('../roles/role.repository');
const { hashPassword } = require('../../utils/password');

class UserService {
  constructor(userRepository = new UserRepository(), roleRepository = new RoleRepository()) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roles = await this.roleRepository.findRolesByUserId(user.id);
        return { ...user, roles: roles.map((role) => role.name) };
      }),
    );
    return usersWithRoles;
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return user;
  }

  async createUser({ username, email, password, roleName = 'USER' }) {
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError('El email ya está registrado', 409);
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new AppError('El username ya está registrado', 409);
    }

    const passwordHash = await hashPassword(password);
    const role = await this.roleRepository.findByName(roleName);

    const db = require('../../config/database');
    return db.transaction(async (trx) => {
      const [user] = await this.userRepository.create(
        {
          username,
          email,
          password_hash: passwordHash,
          is_active: true,
        },
        trx,
      );

      if (role) {
        await this.roleRepository.assignRoleToUser(user.id, role.id, trx);
      }

      const roles = role ? [role.name] : [];
      return { ...user, roles };
    });
  }
}

module.exports = UserService;
