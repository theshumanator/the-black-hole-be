const {fetchAllTopics, insertNewTopic} = require('../models/topics');

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
        .then(topics => {
            res.status(200).json({topics});
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err);
        })
};

exports.postTopic = (req, res, next) => {
    insertNewTopic(req.body)
        .then(topics => {            
            res.status(201).json({topics});
        })
        .catch(error => {
            const err = {status: 400, msg: error.detail};
            next(err);
        });
};