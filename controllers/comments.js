const {modifyVote, removeComment, fetchAllComments} = require('../models/comments');

exports.getAllComments = (req, res, next) => {
    fetchAllComments()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {                        
            const err = {status: 404, msg: error};
            next(err)
        })
};

exports.updateCommentVote = (req, res, next) => {
    
    if (!('inc_votes' in req.body)) {
        const err = {status: 400, msg: 'Bad Request. inc_votes must be provided'};
        next (err);
    } else {
        if (!('comment_id' in req.params)) {
            const err = {status: 400, msg: 'Bad Request. the comment id must be provided in the url like: api/comments/123'};
            next (err);
        } else {
            const voteDirection = req.body.inc_votes;    
            const comment_id=+req.params.comment_id;  
            //console.log(comment_id, voteDirection)             
            modifyVote(comment_id, voteDirection)
                .then((results) => {
                    if (results.length===0) {
                        const err = {status: 404, msg: 'null'};
                        next(err)
                    } else {
                        res.status(202).json(results);
                    }                                        
                })
                .catch(error => {
                    console.log('Got error');
                    const err = {status: 404, msg: error};
                    next(err);
                })
        }
    }
    
    
}



exports.deleteComment = (req, res, next) => {
    if (!('comment_id' in req.params)) {
        const err = {status: 400, msg: 'Bad Request. the comment id must be provided in the url like: api/comments/123'};
        next (err);
    } else {   
        const comment_id=+req.params.comment_id;  
        removeComment(comment_id)
            .then((results) => {
                console.log('Got results')
                res.status(204).json(results);              
            })
            .catch(error => {
                console.log('Got error');
                const err = {status: 404, msg: error};
                next(err);
            })
    }
}