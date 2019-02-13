const connection = require('../db/connection');

exports.fetchAllTopics = () => connection.select('*').from('topics');

exports.insertNewTopic = newTopic => connection('topics')
  .insert(newTopic)
  .returning('*');
