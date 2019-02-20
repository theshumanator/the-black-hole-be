const usersRouter = require('express').Router();
const { getAllUsers, postUser, getUser } = require('../../controllers/users');
const { unhandledMethod } = require('../../utils/errors');
const { validate } = require('../../utils/requestValidators');

usersRouter.route('/')
  .get(getAllUsers)
  .post(validate('postUser'), postUser)
  .all(unhandledMethod);

usersRouter.route('/:username')
  .get(validate('getUser'), getUser)
  .all(unhandledMethod);

module.exports = usersRouter;
