const commentsRouter = require('express').Router();
const {updateCommentVote, deleteComment} = require('../../controllers/comments');


commentsRouter.patch('/:comment_id', updateCommentVote);
commentsRouter.delete('/:comment_id', deleteComment);

module.exports=commentsRouter;