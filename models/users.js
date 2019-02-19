const connection = require('../db/connection');

// Moved to generic
/* exports.fetchAllUsers = () => connection.select('*').from('users');
exports.insertNewUser = newUser => connection('users')
  .insert(newUser)
  .returning('*');
 */


exports.findUser = username => connection
  .select('*')
  .from('users')
  .where(username);
