const { fetchAll, insertOne } = require('../models/generic');
const { sqlErrorMap } = require('../utils/errors');
const { validationHandler } = require('../utils/requestValidators');

exports.postTopic = (req, res, next) => {
  req
    .getValidationResult()
    .then(validationHandler())
    .then(() => {
      insertOne('topics', req.body)
        .then((topics) => {
          if (topics.length === 0) {
            Promise.reject({ status: 422, msg: 'Could not insert the topic. Contact support' });
            // next(err);
          } else {
            const topic = topics[0];
            res.status(201).json({ topic });
          }
        })
        .catch((error) => {
          const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
          next(err);
        });
    })
    .catch(next);
};

exports.getAllTopics = (req, res, next) => {
  fetchAll('topics')
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch((error) => {
      const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
      next(err);
    });
};
