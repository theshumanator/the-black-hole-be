const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../../controllers/topics');
const { unhandledMethod } = require('../../utils/errors');
const { validate } = require('../../utils/requestValidators');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(validate('postTopic'), postTopic)
  .all(unhandledMethod);


module.exports = topicsRouter;
