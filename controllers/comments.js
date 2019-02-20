const { modifyVote, removeComment, getCommentById } = require('../models/comments');
const { sqlErrorMap } = require('../utils/errors');
const { validationHandler } = require('../utils/requestValidators');

const fetchCommentById = (req, res, next) => {
  const comment_id = +req.params.comment_id;
  getCommentById(comment_id)
    .then((comments) => {
      if (comments.length === 0) {
        const err = { status: 404, msg: `Comment does not exist for given article id: ${comment_id}` };
        next(err);
      } else {
        const comment = comments[0];
        res.status(200).json({ comment });
      }
    })
    .catch((error) => {
      const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
      next(err);
    });
};

exports.updateCommentVote = (req, res, next) => {
  /*

  if (!('inc_votes' in req.body) || !(+req.body.inc_votes)) {
    const err = { status: 400, msg: 'The inc_votes must be
    provided and must be integer' };
    next(err);
  } else if (!('comment_id' in req.params)) {
    const err = { status: 400, msg: 'The comment id must be
    provided in the url like: api/comments/123' };
    next(err);
  } else {

    block review: need to return unmodified comment
  */
  req
    .getValidationResult()
    .then(validationHandler())
    .then(() => {
      if (!('inc_votes' in req.body)) {
        fetchCommentById(req, res, next);
      } else if (!(+req.body.inc_votes)) {
        const err = { status: 400, msg: 'The inc_votes must be provided and must be integer' };
        next(err);
      } else {
        const voteDirection = req.body.inc_votes;
        const comment_id = +req.params.comment_id;
        modifyVote(comment_id, voteDirection)
          .then((comments) => {
            if (comments.length === 0) {
              // block review: changing from 400 to 404
              const err = { status: 404, msg: `The comment_id ${comment_id} does not exist.` };
              next(err);
            } else {
              const comment = comments[0];
              res.status(200).json({ comment });
            }
          })
          .catch((error) => {
            const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
            next(err);
          });
      }
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  req
    .getValidationResult()
    .then(validationHandler())
    .then(() => {
      const comment_id = +req.params.comment_id;
      removeComment(comment_id)
        .then((comments) => {
          if (comments.length === 0) {
            const err = { status: 404, msg: `The comment_id ${comment_id} does not exist.` };
            next(err);
          } else {
            res.status(204).send();
          }
        })
        .catch((error) => {
          const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
          next(err);
        });
    })
    .catch(next);
};
