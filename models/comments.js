const connection = require('../db/connection');

const modifyVote = (comment_id, votes) => connection('comments')
  .where('comment_id', '=', comment_id)
  .increment('votes', votes)
  .returning('*');

const removeComment = comment_id => connection('comments')
  .where('comment_id', comment_id)
  .del()
  .returning('*');


module.exports = { modifyVote, removeComment };
