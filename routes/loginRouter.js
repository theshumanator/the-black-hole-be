const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');
const db = require('../db.js');


const { unhandledMethod } = require('../utils/errors');

loginRouter.route('/')
  .post((req, res, next) => {
    const { username, password } = req.body;
    db.one('select * from users where username = $/username/;', { username })
      .then(user => Promise.all([bcrypt.compare(password, user.password), user]))
      .then(([passwordOk, user]) => {
        if (user && passwordOk) {
          const token = jwt.sign(
            { user: user.username, iat: Date.now() },
            JWT_SECRET,
          );
          res.send({ token });
        } else {
          next({ status: 401, msg: 'invalid username or password' });
        }
      })
      .catch((error) => {
        next({ status: 401, msg: 'invalid username or password' });
      });
  })
  .all(unhandledMethod);

module.exports = loginRouter;


/*
{
"username":"23",
"password":"23"
}
*/
