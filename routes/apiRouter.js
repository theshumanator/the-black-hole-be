const apiRouter = require('express').Router();

const { sendAPIInfo } = require('../controllers/apiGateway');

apiRouter.get('/', sendAPIInfo);

module.exports = apiRouter;
