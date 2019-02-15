const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  development: {
    JWT_SECRET: 'secret key',
  },
  test: {
    JWT_SECRET: 'secret key',
  },
};

module.exports = config[NODE_ENV];
