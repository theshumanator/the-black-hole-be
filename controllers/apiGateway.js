const { readJson } = require('../models/apiGateway');

exports.sendAPIInfo = (req, res, next) => {
  readJson((err, data) => {
    if (err) {
      next({ status: 500, msg: 'Could not read api-info.json file' });
    }
    return res.status(200).json(JSON.parse(data));
  });
};
