const pgp = require('pg-promise')();

const config = {
  database: 'login_nc_knews',
  host: 'localhost',
  port: 5432,
};

const db = pgp(config);

module.exports = db;
