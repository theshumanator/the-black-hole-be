const usersRouter = require('express').Router();
const {getAllUsers, postUser, getUser} = require('../../controllers/users');
const {unhandledMethod} = require('../../utils/common-res');

usersRouter.route('/')
    .get(getAllUsers)
    .post(postUser)
    .all(unhandledMethod);

usersRouter.route('/:username')
    .get(getUser)
    .all(unhandledMethod);

module.exports=usersRouter;