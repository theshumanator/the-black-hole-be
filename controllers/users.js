const { findUser } = require('../models/users');
const { fetchAll, insertOne } = require('../models/generic');
const { sqlErrorMap } = require('../utils/errors');
const { validationHandler } = require('../utils/requestValidators');


exports.getAllUsers = (req, res, next) => {
  fetchAll('users')
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  req
    .getValidationResult()
    .then(validationHandler())
    .then(() => {
      findUser(req.params)
        .then((users) => {
          if (users.length === 0) {
            const err = { status: 404, msg: `User does not exist with username ${req.params.username}` };
            next(err);
          } else {
            const user = users[0];
            res.status(200).json({ user });
          }
        })
        .catch((error) => {
          const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
          next(err);
        });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  req
    .getValidationResult()
    .then(validationHandler())
    .then(() => {
      insertOne('users', req.body)
        .then((users) => {
          if (users.length === 0) {
            const err = { status: 422, msg: 'Could not insert the user. Contact support' };
            next(err);
          } else {
            const user = users[0];
            res.status(201).json({ user });
          }
        })
        .catch((error) => {
          const err = { status: sqlErrorMap[error.code] || 422, msg: error.detail };
          next(err);
        });
    })
    .catch(next);
};
