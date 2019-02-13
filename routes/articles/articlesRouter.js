const articlesRouter = require('express').Router();
const {
  getArticles, postArticle, getArticleById, updateArticleVote,
  deleteArticle, getCommentsForArticle, postCommentForArticle,
} = require('../../controllers/articles');
const { unhandledMethod } = require('../../utils/common-res');

articlesRouter.route('/')
  .get(getArticles)
  .post(postArticle)
  .all(unhandledMethod);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleVote)
  .delete(deleteArticle)
  .all(unhandledMethod);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(postCommentForArticle)
  .all(unhandledMethod);

module.exports = articlesRouter;
