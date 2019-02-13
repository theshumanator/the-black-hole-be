const {fetchAllUsers, insertNewUser, findUser} = require('../models/users');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then(users => {
            res.status(200).json({users});
        })
        .catch(error => {                        
            const err = {status: 404, msg: error};
            next(err);
        })
};

exports.getUser = (req, res, next) => {       
    findUser(req.params)
    .then(users => {
        if (users.length===0) {
            const err = {status: 404, msg: `User does not exist with username ${req.params.username}`};
            next(err)
        } else {
            res.status(200).json({users});
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
        .then(users => {            
            res.status(201).json({users});
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err)
        });
};