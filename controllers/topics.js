const { fetchAllTopics, insertNewTopic } = require('../models/topics');
const { sqlErrorMap } = require('../utils/common-res');

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch((error) => {
      const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  insertNewTopic(req.body)
    .then((topics) => {
      if (topics.length === 0) {
        const err = { status: 422, msg: 'Could not insert the topic. Contact support' };
        next(err);
      } else {
        const topic = topics[0];
        res.status(201).json({ topic });
      }
    })
    .catch((error) => {
      console.log(error.code);
      const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
      next(err);
    });
};
