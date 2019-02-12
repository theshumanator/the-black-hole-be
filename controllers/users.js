const {fetchAllUsers, insertNewUser, findUser} = require('../models/users');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            res.status(404).json(err);
        })
};

exports.getUser = (req, res, next) => {    
    findUser(req.params)
        .then(results => {
            if (results.length===0) {
                res.status(404).json(null);
            } else {
                res.status(200).json(results);
            }
            
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            res.status(404).json(err);
        })
};

exports.postUser = (req, res, next) => {
    insertNewUser(req.body)
        .then(results => {            
            res.status(201).json(results);
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            res.status(404).json(err);
        });
};