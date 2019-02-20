const { body, param } = require('express-validator/check');

exports.validate = (funct) => {
  switch (funct) {
    case 'postTopic': {
      return [
        body('description', 'is missing from json').exists(),
        body('slug', 'is missing from json').exists()];
    }
    case 'postUser': {
      return [
        body('username', 'is missing from json').exists()];
    }
    case 'getUser': {
      return [
        param('username', 'is missing from the url').exists()];
    }
    case 'updateCommentVote': {
      return [
        param('comment_id', 'must be included in the url').exists().isNumeric().withMessage('must be provided in the url like: api/comments/123')];
    }
    case 'deleteComment': {
      return [
        param('comment_id', 'must be provided in the url like: api/comments/123').exists()];
    }
    case 'postArticle': {
      return [
        body('title', 'is missing from json').exists(),
        body('body', 'is missing from json').exists(),
        body('topic', 'is missing from json').exists(),
        body('username', 'is missing from json').exists()];
    }
    case 'getArticleById':
    case 'updateArticleVote':
    case 'deleteArticle':
    case 'getCommentsForArticle':
    {
      return [
        param('article_id', 'must be included in the url and must be an integer').exists().isNumeric()];
    }
    case 'postCommentForArticle':
    {
      return [
        param('article_id', 'must be included in the url and must be an integer').exists().isNumeric(),
        body('username', 'is missing from json').exists(),
        body('body', 'is missing from json').exists()];
    }
    default:
      return [];
  }
};


exports.validationHandler = next => (result) => {
  if (!result.isEmpty()) {
    if (!next) {
      const err = result.array().map(i => `${i.param} ${i.msg}`).join(' ');
      return Promise.reject({ status: 400, msg: err });
    }
    const err = result.array().map(i => `${i.param} ${i.msg}`).join('');
    return Promise.reject({ status: 400, msg: err });
  }
};
