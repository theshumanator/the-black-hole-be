const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { handleErrors } = require('./utils/errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

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
