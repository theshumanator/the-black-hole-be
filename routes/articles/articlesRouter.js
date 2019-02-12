const articlesRouter = require('express').Router();
const {getArticles, postArticle, getArticleById, updateArticleVote, deleteArticle,getCommentsForArticle,postCommentForarticle} = require('../../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.post('/', postArticle);

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', updateArticleVote);
articlesRouter.delete('/:article_id', deleteArticle);

articlesRouter.get('/:article_id/comments', getCommentsForArticle);
articlesRouter.post('/:article_id/comments', postCommentForarticle);

module.exports=articlesRouter;