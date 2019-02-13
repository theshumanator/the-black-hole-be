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
            if(topics.length===0) {
                const err = {status: 422, msg: 'Could not insert the topic. Contact support'};
                next(err)
            } else {
                const topic=topics[0];         
                res.status(201).json({topic});
            }  
        })
        .catch(error => {
            const err = {status: 400, msg: error.detail};
            next(err);
        });
};