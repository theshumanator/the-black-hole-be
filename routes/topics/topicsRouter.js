const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../../controllers/topics');
const { unhandledMethod } = require('../../utils/errors');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(unhandledMethod);


module.exports = topicsRouter;
