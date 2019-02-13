const {fetchAllArticles, getArticleCount, insertArticle, modifyVote, removeArticle, fetchCommentsForArticle, insertCommentForArticle} = require('../models/articles');

const getArticles = (req, res, next) => {
    getArticleCount(req.query)
        .then(result => {
            if (result.length===0){
                const err = {status: 404, msg: 'null'};
                next(err);
            } else {
                articleCount = result[0].total_count;            
            fetchAllArticles(req.query)
                .then(articles => {
                    if (articles.length===0) {
                        const err = {status: 404, msg: 'null'};
                        next(err);
                    } else {
                        articles[0]['total_count']=+articleCount;  
                        res.status(200).json({articles});
                    }                    
                })
                .catch(error => {
                    console.log(error);
                    const err = {status: 404, msg: error};
                    next(err);
                })                
            }            
        })
        .catch(error => {
            console.log(error);
            const err = {status: 404, msg: error};
            next(err);
        })
};

const postArticle = (req, res, next) => {
    const articleObj = {};
    if ( !(req.body) || !('title' in req.body) || !('body' in req.body) || !('topic' in req.body) || !('username' in req.body)) {
        const err = {status: 400, msg: 'Missing data in the json. JSON must include: title, body, topic and username'};
        next(err);
    } else {
        articleObj['title'] = req.body.title;
        articleObj['body'] = req.body.body;
        articleObj['topic'] = req.body.topic;
        articleObj['author'] = req.body.username;

        if ('votes' in req.body && (+req.body.votes)) {
            articleObj['votes'] = req.body.votes;
        }
        
        insertArticle(articleObj)
            .then(articles => {
                res.status(201).json({articles});
            })
            .catch(error => {
                const err = {status: 404, msg: error.detail};
                next(err);
            })
    }
};

const getArticleById = (req, res, next) => {
    fetchAllArticles(req.params)
    .then(articles => {
        if (articles.length===0) {
            const err = {status: 404, msg: 'null'};
            next(err)
        } else {
            res.status(200).json({articles});
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
                .then((articles) => {
                    if (articles.length===0) {
                        const err = {status: 404, msg: 'null'};
                        next(err)
                    } else {
                        res.status(202).json({articles});
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
            .then((articles) => {
                if (articles.length===0) {
                    const err = {status: 404, msg: 'null'};
                    next(err)
                } else {
                    res.status(200).json({articles});              
                }
                
            })
            .catch(error => {
                console.log('Got error ' + error);
                const err = {status: 404, msg: error};
                next(err);
            })
    }
};
const postCommentForArticle = (req, res, next) => {
    if (!('article_id' in req.params)) {
        const err = {status: 400, msg: 'Bad Request. the article id must be provided in the url like: api/articles/123/comments'};
        next (err);
    } else {           
        if (!('username' in req.body) || !('body' in req.body)) {
            const err = {status: 400, msg: 'Bad Request. JSON needs a username and body'};
            next (err);
        } else {
            const article_id=+req.params.article_id;  
            
            const commentObj = {
                body: req.body.body,
                author: req.body.username,
                article_id: article_id
            };
            insertCommentForArticle(commentObj)
                .then((comments) => {
                    if (comments.length===0) {
                        const err = {status: 404, msg: 'null'};
                        next(err)
                    } else {
                        res.status(201).json({comments});              
                    }
                    
                })
                .catch(error => {
                    console.log('Got error ' + error);
                    const err = {status: 404, msg: error};
                    next(err);
                })
        }
    }
};
module.exports = {getArticles, postArticle, getArticleById, updateArticleVote, deleteArticle,getCommentsForArticle,postCommentForArticle} ;


