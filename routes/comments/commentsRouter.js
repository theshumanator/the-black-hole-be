const commentsRouter = require('express').Router();
const {updateCommentVote, deleteComment, getAllComments} = require('../../controllers/comments');

commentsRouter.get('/', getAllComments);
commentsRouter.patch('/:comment_id', updateCommentVote);
commentsRouter.delete('/:comment_id', deleteComment);

module.exports=commentsRouter;