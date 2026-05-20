const AppError = require('../shared/errors/AppError');
const { verifyToken } = require('../utils/jwt');
const UserRepository = require('../modules/users/user.repository');
const RoleRepository = require('../modules/roles/role.repository');
const SessionService = require('../modules/sessions/session.service');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const sessionService = new SessionService();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token no proporcionado', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new AppError('Token inválido o expirado', 401);
    }

    const session = await sessionService.getActiveSession(token);
    if (!session) {
      throw new AppError('Sesión inválida o expirada', 401);
    }

    const user = await userRepository.findById(decoded.sub);
    if (!user || !user.is_active) {
      throw new AppError('Usuario no autorizado', 401);
    }

    const roles = await roleRepository.findRolesByUserId(user.id);

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roles.map((role) => role.name),
    };
    req.token = token;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
