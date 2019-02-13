const apiRouter = require('express').Router();
const topicsRouter = require('./topics/topicsRouter');
const commentsRouter = require('./comments/commentsRouter');
const articlesRouter = require('./articles/articlesRouter');
const usersRouter = require('./users/usersRouter');

const { sendAPIInfo } = require('../controllers/apiGateway');
const {unhandledMethod} = require('../utils/common-res');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.route('/')
    .get(sendAPIInfo)
    .all(unhandledMethod);

module.exports = apiRouter;
