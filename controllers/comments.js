const {modifyVote, removeComment} = require('../models/comments');

exports.updateCommentVote = (req, res, next) => {
    
    if (!('inc_votes' in req.body) || !(+req.body.inc_votes)) {
        const err = {status: 400, msg: 'The inc_votes must be provided and must be integer'};
        next (err);
    } else {        
        if (!('comment_id' in req.params)) {
            const err = {status: 400, msg: 'The comment id must be provided in the url like: api/comments/123'};
            next (err);
        } else {
            const voteDirection = req.body.inc_votes;    
            const comment_id=+req.params.comment_id;             
            modifyVote(comment_id, voteDirection)
                .then((comments) => {
                    if (comments.length===0) {
                        const err = {status: 404, msg: `The comment_id ${comment_id} does not exist.`};
                        next(err)
                    } else {
                        res.status(202).json({comments});
                    }                                        
                })
                .catch(error => {
                    console.log('Got error');
                    const err = {status: 404, msg: error.detail};
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
            .then((comments) => {                
                if(comments.length===0) {
                    const err = {status: 404, msg: `The comment_id ${comment_id} does not exist.`};
                    next(err);
                } else {
                    res.status(204).send();    
                }
                
            })
            .catch(error => {
                console.log('Got error');
                const err = {status: 404, msg: error.detail};
                next(err);
            })
    }
}