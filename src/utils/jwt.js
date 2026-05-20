const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

const verifyToken = (token) => jwt.verify(token, env.jwt.secret);

const getTokenExpiration = () => {
  const expiresIn = env.jwt.expiresIn;

  if (typeof expiresIn === 'string' && expiresIn.endsWith('h')) {
    const hours = Number(expiresIn.replace('h', ''));
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  if (typeof expiresIn === 'string' && expiresIn.endsWith('d')) {
    const days = Number(expiresIn.replace('d', ''));
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  const seconds = Number(expiresIn) || 86400;
  return new Date(Date.now() + seconds * 1000);
};

module.exports = {
  signToken,
  verifyToken,
  getTokenExpiration,
};
