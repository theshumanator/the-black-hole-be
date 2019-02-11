const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  const incorrectRoute = req.params['0'];
  const err = {
    status: 404,
    msg: `Unhandled route error! ${incorrectRoute}`,
  };
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
});

module.exports = app;
