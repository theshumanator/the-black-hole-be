const connection = require('../db/connection');

const fetchAllArticles = (userQuery) => {
    const  {        
        sort_by = 'a.created_at',
        order = 'desc',
        limit = 10,
        p = 1,
        ...queries} = userQuery;

    const whereQuery = {...queries};
    const newWhereQuery = {};
    const unionQuery = {};

    if ('author' in whereQuery) {
        newWhereQuery['a.author'] = whereQuery.author;
        unionQuery['b.author'] = whereQuery.author;
    }
    if ('topic' in whereQuery) {
        newWhereQuery['a.topic'] = whereQuery.topic;
        unionQuery['b.topic'] = whereQuery.topic;
    }
    if ('article_id' in whereQuery) {
        newWhereQuery['a.article_id'] = whereQuery.article_id;
        unionQuery['b.article_id'] = whereQuery.article_id;
    }

    const offset = ((p * limit) - limit);
        return connection
            .select('a.article_id', 'a.title', 'a.topic', 'a.votes', 'a.author', 'a.created_at')
            .from('articles as a')                        
            .leftJoin('comments as c', 'c.article_id', 'a.article_id').where(newWhereQuery)
            .count('c.comment_id as comment_count')
            .groupBy('a.article_id')
            .orderBy(sort_by, order)
            .offset(offset)
            .limit(limit);
};

const getArticleCount = (whereQuery) => {
    const newWhereQuery = {};

    if ('author' in whereQuery) {
        newWhereQuery['a.author'] = whereQuery.author;
    }
    if ('topic' in whereQuery) {
        newWhereQuery['a.topic'] = whereQuery.topic;
    }
    if ('article_id' in whereQuery) {
        newWhereQuery['a.article_id'] = whereQuery.article_id;
    }

    return connection                        
        .from ('articles as a')
        .count('a.article_id as total_count')
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

const fetchCommentsForArticle = (userQuery, article_id) => {    
    const  {
        limit = 10,
        p = 1,        
        sort_by= 'c.created_at',
        order= 'desc'} = userQuery;

    const offset = ((p * limit) - limit);
    return connection
        .select('c.comment_id', 'c.votes', 'c.created_at', 'c.author', 'c.body' )
        .from('comments as c')
        .where('c.article_id', article_id)     
        .orderBy(sort_by, order)
        .offset(offset)
        .limit(limit)
};

const insertCommentForArticle = (commentObj) => {
    return connection('comments')
        .insert(commentObj)
        .returning('*');

};

module.exports = {fetchAllArticles, getArticleCount, insertArticle, modifyVote, removeArticle, fetchCommentsForArticle, insertCommentForArticle};