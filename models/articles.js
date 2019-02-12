const connection = require('../db/connection');

const fetchAllArticles = (userQuery) => {
    const  {        
        sort_by= 'a.created_at',
        order= 'desc',
        ...queries} = userQuery;

    const whereQuery = {...queries};
    const newWhereQuery = {};

    if ('author' in whereQuery) {
        newWhereQuery['a.author'] = whereQuery.author;
    }
    if ('topic' in whereQuery) {
        newWhereQuery['topic'] = whereQuery.topic;
    }
    if ('article_id' in whereQuery) {
        newWhereQuery['a.article_id'] = whereQuery.article_id;
    }

    return connection
        .select('a.article_id', 'a.title', 'a.topic', 'a.votes', 'a.author', 'a.created_at')
        .from('articles as a')                
        .leftJoin('comments as c', 'c.article_id', 'a.article_id')
        .count('c.comment_id as comment_count')
        .groupBy('a.article_id')
        .orderBy(sort_by, order)
        .where(newWhereQuery);
};

const insertArticle = (article) => {
    return connection('articles')
        .insert(article)
        .returning('*');
};


const modifyVote = (article_id, votes) => {
    return connection('articles')
        .where('article_id', '=', article_id) 
        .increment('votes', votes)
        .returning('*');
};

const removeArticle = (article_id) => {
    return connection('comments')
        .where('article_id', article_id)
        .del()
        .then(() => {
            return connection('articles').where('article_id', article_id).del()
        })
};

const fetchCommentsForArticle = () => {

};

const postCommentForArticle = () => {

};

module.exports = {fetchAllArticles, insertArticle, modifyVote, removeArticle, fetchCommentsForArticle, postCommentForArticle};