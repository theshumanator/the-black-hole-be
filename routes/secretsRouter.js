const secretsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const db = require('../db.js');


const { unhandledMethod } = require('../utils/errors');


secretsRouter.route('/')
  .get((req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, resp) => {
      if (err) {
        next({ status: 401, msg: 'Unauthorised' });
      } else {
        db.many('select * from secrets')
          .then((secrets) => {
            res.send({ secrets });
          })
          .catch((error) => {
            next({ status: 422, msg: 'Could not fetch the secrets' });
          });
      }
    });
  })
  .all(unhandledMethod);

module.exports = secretsRouter;
