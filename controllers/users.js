const {fetchAllUsers, insertNewUser, findUser} = require('../models/users');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {                        
            const err = {status: 404, msg: error};
            next(err);
        })
};

exports.getUser = (req, res, next) => {       
    findUser(req.params)
    .then(results => {
        if (results.length===0) {
            const err = {status: 404, msg: `User does not exist with username ${req.params.username}`};
            next(err)
        } else {
            res.status(200).json(results);
        }        
    })
    .catch(error => {
        console.log(error);
        const err = {status: 404, msg: error};
        next(err)
    });
};

exports.postUser = (req, res, next) => {
    insertNewUser(req.body)
        .then(results => {            
            res.status(201).json(results);
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err)
        });
};