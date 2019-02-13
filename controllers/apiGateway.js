exports.sendAPIInfo = (req, res, next) => {
  const apiObj = {
    Topics: {
      GET: '/api/topics',
      POST: '/api/topics',
    },
    Articles: {
      GET: '/api/articles',
      POST: '/api/articles',
    },
    Article: {
      GET: '/api/articles/:article_id',
      PATCH: '/api/articles/:article_id',
      DELETE: '/api/articles/:article_id',
    },
    'Comments of article': {
      GET: '/api/articles/:article_id/comments',
      POST: '/api/articles/:article_id/comments',
    },
    Comments: {
      PATCH: '/api/comments/:comment_id',
      DELETE: '/api/comments/:comment_id',
    },
    Users: {
      GET: '/api/users',
      POST: '/api/users',
    },
    User: {
      GET: '/api/users/:username',
    },
    API: {
      GET: '/api',
    },
  };

  return res.status(200).json(apiObj);
};
