const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../../controllers/topics');
const { unhandledMethod } = require('../../utils/common-res');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postTopic)
  .all(unhandledMethod);


module.exports = topicsRouter;
