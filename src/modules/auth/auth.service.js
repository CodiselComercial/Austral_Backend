const AppError = require('../../shared/errors/AppError');
const UserRepository = require('../users/user.repository');
const RoleRepository = require('../roles/role.repository');
const SessionService = require('../sessions/session.service');
const UserService = require('../users/user.service');
const { comparePassword } = require('../../utils/password');

class AuthService {
  constructor(
    userRepository = new UserRepository(),
    roleRepository = new RoleRepository(),
    sessionService = new SessionService(),
    userService = new UserService(),
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.sessionService = sessionService;
    this.userService = userService;
  }

  async register({ username, email, password }) {
    const user = await this.userService.createUser({
      username,
      email,
      password,
      roleName: 'USER',
    });

    const session = await this.sessionService.createSession(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      token: session.token,
      expires_at: session.expires_at,
    };
  }

  async login({ username, email, password }) {
    const identifier = email || username;
    const user = await this.userRepository.findByEmailOrUsername(identifier);

    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    if (!user.is_active) {
      throw new AppError('Usuario inactivo', 403);
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const roles = await this.roleRepository.findRolesByUserId(user.id);
    const session = await this.sessionService.createSession(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: roles.map((role) => role.name),
      },
      token: session.token,
      expires_at: session.expires_at,
    };
  }

  async logout(token) {
    await this.sessionService.revokeSession(token);
    return { message: 'Sesión cerrada correctamente' };
  }
}

module.exports = AuthService;
