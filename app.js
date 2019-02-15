const app = require('express')();
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
const { handleErrors } = require('./utils/errors');
const apiRouter = require('./routes/apiRouter');
// const { JWT_SECRET } = require('./config');

app.use(bodyParser.json());

app.use('/api', apiRouter);


/* app.use((req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, res) => {
    if (err) {
      // console.log(err);
      next({ status: 401, msg: 'Unauthorised' });
    } else next();
  });
}); */


app.all('/*', (req, res, next) => {
  const incorrectRoute = req.params['0'];
  const err = {
    status: 404,
    msg: `Unhandled route error! ${incorrectRoute}`,
  };
  next(err);
});
app.use(handleErrors);

module.exports = app;
