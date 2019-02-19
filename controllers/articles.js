const {
  fetchAllArticles, getArticleCount, modifyVote,
  removeArticle, fetchCommentsForArticle, fetchAllArticleById,
  // replace with generic insertArticle, insertCommentForArticle,
} = require('../models/articles');
const { insertOne } = require('../models/generic');
const { sqlErrorMap } = require('../utils/errors');

const getArticles = (req, res, next) => {
  getArticleCount(req.query)
    .then((totalCount) => {
      if (totalCount.length === 0) {
        const err = { status: 404, msg: 'There are no articles in the database' };
        next(err);
      } else {
        const articleCount = totalCount[0].total_count;
        fetchAllArticles(req.query)
          .then((articles) => {
            if (articles.length === 0) {
              /* block review expect it to be 200 not 404
              const err = { status: 404, msg: 'No articles available' };
              next(err); */
              fetchAllArticles(req.query, true)
                .then((allArticles) => {
                  if (allArticles.length === 0) {
                    const err = { status: 404, msg: 'There are no articles in the database' };
                    next(err);
                  } else {
                    const articleObj = {
                      articles: allArticles,
                      total_count: +articleCount,
                    };
                    res.status(200).json(articleObj);
                  }
                });
            } else {
              const articleObj = {
                articles,
                total_count: +articleCount,
              };
              res.status(200).json(articleObj);
            }
          })
          .catch((error) => {
            const err = { status: 404, msg: error.detail };
            next(err);
          });
      }
    })
    .catch((error) => {
      const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
      next(err);
    });
};

const postArticle = (req, res, next) => {
  if (!(req.body) || !('title' in req.body) || !('body' in req.body) || !('topic' in req.body) || !('username' in req.body)) {
    const err = { status: 400, msg: 'Missing data in the json. JSON must include: title, body, topic and username' };
    next(err);
  } else {
    const {
      title, body, topic, username,
    } = req.body;
    const articleObj = { title, body, topic };
    articleObj.author = username;

    if ('votes' in req.body && (+req.body.votes)) {
      articleObj.votes = req.body.votes;
    }

    insertOne('articles', articleObj)
      .then((articles) => {
        if (articles.length === 0) {
          const err = { status: 404, msg: 'Could not insert article. Contact support' };
          next(err);
        } else {
          const article = articles[0];
          res.status(201).json({ article });
        }
      })
      .catch((error) => {
        const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
        next(err);
      });
  }
};

const getArticleById = (req, res, next) => {
  if (!('article_id' in req.params) || !(+req.params.article_id)) {
    const err = { status: 400, msg: `Article id: ${req.params.article_id} must be an integer.` };
    next(err);
  } else {
    fetchAllArticleById(req.params)
      .then((articles) => {
        if (articles.length === 0) {
          const err = { status: 404, msg: `Article does not exist for given article id: ${req.params.article_id}` };
          next(err);
        } else {
          const article = articles[0];
          res.status(200).json({ article });
        }
      })
      .catch((error) => {
        const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
        next(err);
      });
  }
};

const updateArticleVote = (req, res, next) => {
  /* if (!('inc_votes' in req.body) || !(+req.body.inc_votes)) {
    const err = { status: 400, msg: 'Bad Request. inc_votes must
     be provided and must be an integer' };
    next(err);
  }  else if (!('article_id' in req.params)) {
    const err = { status: 400, msg: 'Bad Request. the article
    id must be provided in the url like: /api/articles/123' };
    next(err);
  }
  block review: need to return unmodified article if no vote provided
  */

  if (!('article_id' in req.params)) {
    const err = { status: 400, msg: 'Bad Request. the article id must be provided in the url like: /api/articles/123' };
    next(err);
  } else if (!('inc_votes' in req.body)) {
    getArticleById(req, res, next);
  } else if (!(+req.body.inc_votes)) {
    const err = { status: 400, msg: 'Bad Request. inc_votes must be provided and must be an integer' };
    next(err);
  } else {
    const voteDirection = req.body.inc_votes;
    const article_id = +req.params.article_id;
    modifyVote(article_id, voteDirection)
      .then((articles) => {
        if (articles.length === 0) {
          const err = { status: 404, msg: `Article does not exist for given article id: ${req.params.article_id}` };
          next(err);
        } else {
          const article = articles[0];
          // block review: needs to be 200
          res.status(200).json({ article });
        }
      })
      .catch((error) => {
        const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
        next(err);
      });
  }
};

const deleteArticle = (req, res, next) => {
  if (!('article_id' in req.params) || !(+req.params.article_id)) {
    const err = { status: 400, msg: 'The article id must be an integer and provided in the url like: api/articles/123' };
    next(err);
  } else {
    const article_id = +req.params.article_id;
    removeArticle(article_id)
      .then((numberDeleted) => {
        if (numberDeleted === 0) {
          const err = { status: 404, msg: `The article id ${article_id} does not exist in the database.` };
          next(err);
        } else {
          res.status(204).send();
        }
      })
      .catch((error) => {
        const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
        next(err);
      });
  }
};

const getCommentsForArticle = (req, res, next) => {
  if (!('article_id' in req.params) || !(+req.params.article_id)) {
    const err = { status: 400, msg: 'The article id must be provided in the url like: api/articles/123/comments and must be an integer' };
    next(err);
  } else {
    const article_id = +req.params.article_id;
    fetchCommentsForArticle(req.query, article_id)
      .then((comments) => {
        if (comments.length === 0) {
          const err = { status: 404, msg: `Article does not exist for given article id: ${article_id}` };
          next(err);
        } else {
          res.status(200).json({ comments });
        }
      })
      .catch((error) => {
        const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
        next(err);
      });
  }
};
const postCommentForArticle = (req, res, next) => {
  if (!('article_id' in req.params)) {
    const err = { status: 400, msg: 'The article id must be provided in the url like: api/articles/123/comments' };
    next(err);
  } else if (!('username' in req.body) || !('body' in req.body)) {
    const err = { status: 400, msg: 'JSON needs a username and body' };
    next(err);
  } else {
    const article_id = +req.params.article_id;

    const commentObj = {
      body: req.body.body,
      author: req.body.username,
      article_id,
    };

    insertOne('comments', commentObj)
      .then((comments) => {
        if (comments.length === 0) {
          const err = { status: 404, msg: `Article does not exist for given article id: ${article_id}` };
          next(err);
        } else {
          const comment = comments[0];
          res.status(201).json({ comment });
        }
      })
      .catch((error) => {
        const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
        next(err);
      });
  }
};
module.exports = {
  getArticles,
  postArticle,
  getArticleById,
  updateArticleVote,
  deleteArticle,
  getCommentsForArticle,
  postCommentForArticle,
};
