const { fetchAllUsers, insertNewUser, findUser } = require('../models/users');
const { sqlErrorMap } = require('../utils/errors');

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      const err = { status: sqlErrorMap[error.code] || 404, msg: error.detail };
      next(err);
    });
};

exports.getUser = (req, res, next) => {
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
};

exports.postUser = (req, res, next) => {
  if (!('username' in req.body)) {
    const err = { status: 400, msg: 'The username is missing in json.' };
    next(err);
  } else {
    insertNewUser(req.body)
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
  }
};
