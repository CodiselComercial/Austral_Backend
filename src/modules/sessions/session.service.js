const SessionRepository = require('./session.repository');
const { signToken, getTokenExpiration } = require('../../utils/jwt');

class SessionService {
  constructor(sessionRepository = new SessionRepository()) {
    this.sessionRepository = sessionRepository;
  }

  async createSession(userId) {
    const expiresAt = getTokenExpiration();
    const token = signToken({ sub: userId });

    await this.sessionRepository.deleteExpiredByUserId(userId);

    const [session] = await this.sessionRepository.create({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });

    return session;
  }

  getActiveSession(token) {
    return this.sessionRepository.findActiveByToken(token);
  }

  revokeSession(token) {
    return this.sessionRepository.deleteByToken(token);
  }
}

module.exports = SessionService;
