const app = require('express')();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');

const { handleErrors } = require('./utils/errors');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(expressValidator());

/* app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
}); */


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
