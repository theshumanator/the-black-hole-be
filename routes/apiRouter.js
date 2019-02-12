const apiRouter = require('express').Router();
const topicsRouter = require('./topics/topicsRouter');
const commentsRouter = require('./comments/commentsRouter');
//const articlesRouter = require('./articles/articlesRouter');
const usersRouter = require('./users/usersRouter');

const { sendAPIInfo } = require('../controllers/apiGateway');

apiRouter.get('/', sendAPIInfo);

apiRouter.use('/topics', topicsRouter);
//apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
