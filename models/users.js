const connection = require('../db/connection');

exports.fetchAllUsers = () => connection.select('*').from('users');

exports.findUser = username => connection
  .select('*')
  .from('users')
  .where(username);

exports.insertNewUser = newUser => connection('users')
  .insert(newUser)
  .returning('*');
