const connection = require('../db/connection');

const modifyVote = (comment_id, votes) => {
    //console.log(comment_id, votes);     
     return connection('comments')
        .where('comment_id', '=', comment_id) 
        .increment('votes', votes)
        .returning('*')
}

const removeComment = (comment_id) => {
    return connection('comments')
        .where('comment_id', comment_id) 
        .del();
}

const fetchAllComments = () => {
    return connection.select('*').from('comments')        
}
module.exports={modifyVote, removeComment, fetchAllComments}