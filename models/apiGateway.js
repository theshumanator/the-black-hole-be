const fs = require('fs');

exports.readJson = (cb) => {
  fs.readFile('./api-info.json', 'utf8', (error, data) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, data);
    }
  });
};
