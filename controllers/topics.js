const { fetchAllTopics, insertNewTopic } = require('../models/topics');
const { sqlErrorMap } = require('../utils/errors');

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
  if (!(req.body) || !('description' in req.body) || !('slug' in req.body)) {
    const err = { status: 400, msg: 'Missing data in the json. JSON must include: slug and description' };
    next(err);
  }
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
      const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
      next(err);
    });
};
