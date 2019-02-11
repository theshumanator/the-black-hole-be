exports.sendAPIInfo = (req, res, next) => {
  const arr = ['GET => /api/topics', 'POST => /api/topics', 'GET => /api/articles', 'POST => /api/articles', 'GET => /api/articles/:article_id', 'PATCH => /api/articles/:article_id', 'DELETE => /api/articles/:article_id', 'GET => /api/articles/:article_id/comments', 'POST => /api/articles/:article_id/comments', 'PATCH => /api/comments/:comment_id', 'DELETE => /api/comments/:comment_id', 'GET => /api/users', 'POST => /api/users', 'GET => /api/users/:username', 'GET => /api'];
  const arrStr = arr.reduce((acc, element) => {
    acc += `    ${element}`;
    return acc;
  }, '');
  const response = { msg: `The following API endpoints are possible:  ${arrStr}` };

  return res.status(200).json(response);
};
