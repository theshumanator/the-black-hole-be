const commentsRouter = require('express').Router();
const { updateCommentVote, deleteComment } = require('../../controllers/comments');
const { unhandledMethod } = require('../../utils/errors');
const { validate } = require('../../utils/requestValidators');

commentsRouter.route('/:comment_id')
  .patch(validate('updateCommentVote'), updateCommentVote)
  .delete(validate('deleteComment'), deleteComment)
  .all(unhandledMethod);

module.exports = commentsRouter;
