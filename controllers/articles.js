const {fetchAllArticles, insertArticle, modifyVote, removeArticle, fetchCommentsForArticle, postCommentForArticle} = require('../models/articles');

const getArticles = (req, res, next) => {
    fetchAllArticles(req.query)
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err);
        })
};

const postArticle = (req, res, next) => {
    const articleObj = {};
    if (req.body) {
        articleObj['title'] = req.body.title;
        articleObj['body'] = req.body.body;
        articleObj['topic'] = req.body.topic;
        articleObj['author'] = req.body.username;
    }
    insertArticle(articleObj)
        .then(results => {
            res.status(201).json(results);
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err);
        })
};

const getArticleById = (req, res, next) => {
    fetchAllArticles(req.params)
    .then(results => {
        if (results.length===0) {
            const err = {status: 404, msg: 'null'};
            next(err)
        } else {
            res.status(200).json(results);
        }
        
    })
    .catch(error => {
        console.log(error);
        const err = {status: 404, msg: error};
        next(err)
    })
};

const updateArticleVote = (req, res, next) => {
    if (!('inc_votes' in req.body)) {
        const err = {status: 400, msg: 'Bad Request. inc_votes must be provided'};
        next (err);
    } else {
        if (!('article_id' in req.params)) {
            const err = {status: 400, msg: 'Bad Request. the article id must be provided in the url like: api/articles/123'};
            next (err);
        } else {
            const voteDirection = req.body.inc_votes;    
            const article_id=+req.params.article_id;             
            modifyVote(article_id, voteDirection)
                .then((results) => {
                    if (results.length===0) {
                        const err = {status: 404, msg: 'null'};
                        next(err)
                    } else {
                        res.status(202).json(results);
                    }                                        
                })
                .catch(error => {
                    console.log('Got error: ');
                    const err = {status: 404, msg: error};
                    next(err);
                })
        }
    }
};

const deleteArticle = (req, res, next) => {
    if (!('article_id' in req.params)) {
        const err = {status: 400, msg: 'Bad Request. the article id must be provided in the url like: api/articles/123'};
        next (err);
    } else {   
        const article_id=+req.params.article_id;  
        removeArticle(article_id)
            .then((results) => {
                console.log('Got results')
                res.status(204).json(results);              
            })
            .catch(error => {
                console.log('Got error ' + error);
                const err = {status: 404, msg: error};
                next(err);
            })
    }
};

const getCommentsForArticle = (req, res, next) => {
    if (!('article_id' in req.params)) {
        const err = {status: 400, msg: 'Bad Request. the article id must be provided in the url like: api/articles/123/comments'};
        next (err);
    } else {   
        const article_id=+req.params.article_id;  
        fetchCommentsForArticle(req.query, article_id)
            .then((results) => {
                console.log('Got results')
                if (results.length===0) {
                    const err = {status: 404, msg: 'null'};
                    next(err)
                } else {
                    res.status(200).json(results);              
                }
                
            })
            .catch(error => {
                console.log('Got error ' + error);
                const err = {status: 404, msg: error};
                next(err);
            })
    }
};
const postCommentForarticle = (req, res, next) => {
    
};
module.exports = {getArticles, postArticle, getArticleById, updateArticleVote, deleteArticle,getCommentsForArticle,postCommentForarticle} ;


