const { readJson } = require('../models/apiGateway');
const { formError } = require('../utils/errors');

exports.sendAPIInfo = (req, res, next) => {
  readJson((err, data) => {
    if (err) {
      next(formError(err.code));
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
};
