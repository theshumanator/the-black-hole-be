const articlesRouter = require('express').Router();
const {
  getArticles, postArticle, getArticleById, updateArticleVote,
  deleteArticle, getCommentsForArticle, postCommentForArticle,
} = require('../../controllers/articles');
const { unhandledMethod } = require('../../utils/errors');
const { validate } = require('../../utils/requestValidators');

articlesRouter.route('/')
  .get(getArticles)
  .post(validate('postArticle'), postArticle)
  .all(unhandledMethod);

articlesRouter.route('/:article_id')
  .get(validate('getArticleById'), getArticleById)
  .patch(validate('updateArticleVote'), updateArticleVote)
  .delete(validate('deleteArticle'), deleteArticle)
  .all(unhandledMethod);

articlesRouter.route('/:article_id/comments')
  .get(validate('getCommentsForArticle'), getCommentsForArticle)
  .post(validate('postCommentForArticle'), postCommentForArticle)
  .all(unhandledMethod);

module.exports = articlesRouter;
