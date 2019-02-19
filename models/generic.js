const connection = require('../db/connection');

exports.fetchAll = tableName => connection.select('*').from(tableName);

exports.insertOne = (tableName, newObj) => connection(tableName)
  .insert(newObj)
  .returning('*');
