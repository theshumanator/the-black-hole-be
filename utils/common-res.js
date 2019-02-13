
exports.sqlErrorMap = {
    23503: 404,
    23505: 400
}

exports.unhandledMethod = (req, res) => {
    res.status(405).json({status: 405, msg: 'The method is not handled for this route'});
}