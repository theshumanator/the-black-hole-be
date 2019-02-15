const commentsRouter = require('express').Router();
const { updateCommentVote, deleteComment } = require('../../controllers/comments');
const { unhandledMethod } = require('../../utils/errors');

commentsRouter.route('/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment)
  .all(unhandledMethod);

module.exports = commentsRouter;
