
exports.sqlErrorMap = {
  23503: 404,
};

const errCodeMsg = {
  ENOENT: 'Could not read api-info.json file',
};

const errodeCodeStatus = {
  ENOENT: 500,
};

exports.unhandledMethod = (req, res) => {
  res.status(405).json({ status: 405, msg: 'The method is not handled for this route' });
};

exports.handleErrors = (err, req, res, next) => {
  res.status(err.status).send(err);
};

exports.formError = (problemo) => {
  const err = {
    status: errodeCodeStatus[problemo],
    msg: errCodeMsg[problemo],
  };
  return err;
};
