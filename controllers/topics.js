const {fetchAllTopics, insertNewTopic} = require('../models/topics');

exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err);
        })
};

exports.postTopic = (req, res, next) => {
    insertNewTopic(req.body)
        .then(results => {            
            res.status(201).json(results);
        })
        .catch(error => {
            const err = {status: 400, msg: error.detail};
            next(err);
        });
};