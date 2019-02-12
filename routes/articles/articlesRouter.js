const articlesRouter = require('express').Router();
const {getArticles, postArticle, getArticleById, updateArticleVote, deleteArticle,getCommentsForArticle,postCommentForarticle} = require('../../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.post('/', postArticle);
articlesRouter.patch('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', updateArticleVote);
articlesRouter.delete('/:article_id', deleteArticle);
articlesRouter.get('/:article_id', getCommentsForArticle);
articlesRouter.post('/:article_id', postCommentForarticle);

module.exports=articlesRouter;