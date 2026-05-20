const knex = require('knex');
const knexConfig = require('../../knexfile');
const env = require('./env');

const config = knexConfig[env.nodeEnv] || knexConfig.development;

const db = knex(config);

module.exports = db;
