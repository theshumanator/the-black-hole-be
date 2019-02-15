// const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');

const dbConfig = { client: 'pg', connection: 'italia' };

const authConnection = knex(dbConfig);
module.exports = authConnection;
