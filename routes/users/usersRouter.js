const usersRouter = require('express').Router();
const {getAllUsers, postUser, getUser} = require('../../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:username', getUser);
usersRouter.post('/', postUser);


module.exports=usersRouter;