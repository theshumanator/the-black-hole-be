const connection = require('../db/connection');

const isValidSort = (sortBy) => {
  const validArticleSort = ['article_id', 'title', 'topic', 'votes', 'author', 'created_at'];
  return validArticleSort.includes(sortBy);
};

const isValidOrder = (order) => {
  const validOrder = ['asc', 'desc'];
  return validOrder.includes(order);
};

const fetchAllArticles = (userQuery) => {
  const limit = userQuery.limit || 10;
  const p = userQuery.p || 1;
  let sort_by = userQuery.sort_by || 'a.created_at';
  let order = userQuery.order || 'desc';


  let whereQuery = {};
  const queryKeys = ['author', 'topic', 'article_id'];
  whereQuery = Object.keys(userQuery).reduce((acc, key) => {
    if (queryKeys.includes(key)) {
      acc[`a.${key}`] = userQuery[key];
    }
    return acc;
  }, {});


  if (isValidSort(sort_by)) {
    sort_by = `a.${sort_by}`;
  } else {
    sort_by = 'a.created_at';
  }

  if (!isValidOrder(order)) {
    order = 'desc';
  }

  const offset = ((p * limit) - limit);
  return connection
    .select('a.article_id', 'a.title', 'a.topic', 'a.votes', 'a.author', 'a.created_at')
    .from('articles as a')
    .leftJoin('comments as c', 'c.article_id', 'a.article_id')
    .where(whereQuery)
    .count('c.comment_id as comment_count')
    .groupBy('a.article_id')
    .orderBy(sort_by, order)
    .offset(offset)
    .limit(limit);
};

const fetchAllArticleById = (userQuery) => {
  const limit = userQuery.limit || 10;
  const p = userQuery.p || 1;
  let sort_by = userQuery.sort_by || 'a.created_at';
  let order = userQuery.order || 'desc';

  const queryKeys = ['author', 'topic', 'article_id'];
  const whereQuery = Object.keys(userQuery).reduce((acc, key) => {
    if (queryKeys.includes(key)) {
      acc[`a.${key}`] = userQuery[key];
    }
    return acc;
  }, {});

  if (isValidSort(sort_by)) {
    sort_by = `a.${sort_by}`;
  } else {
    sort_by = 'a.created_at';
  }

  if (!isValidOrder(order)) {
    order = 'desc';
  }

  const offset = ((p * limit) - limit);
  return connection
    .select('a.article_id', 'a.title', 'a.topic', 'a.votes', 'a.author', 'a.created_at', 'a.body')
    .from('articles as a')
    .leftJoin('comments as c', 'c.article_id', 'a.article_id')
    .where(whereQuery)
    .count('c.comment_id as comment_count')
    .groupBy('a.article_id')
    .orderBy(sort_by, order)
    .offset(offset)
    .limit(limit);
};

const getArticleCount = (whereQuery) => {
  const queryKeys = ['author', 'topic', 'article_id'];
  const newWhereQuery = Object.keys(whereQuery).reduce((acc, key) => {
    if (queryKeys.includes(key)) {
      acc[`a.${key}`] = whereQuery[key];
    }
    return acc;
  }, {});

  return connection
    .from('articles as a')
    .count('a.article_id as total_count')
    .where(newWhereQuery);
};

const getCommentsForArticleCount = whereQuery => connection
  .from('comments as c')
  .count('c.comment_id as total_count')
  .where(whereQuery);

/* replaced by generic
const insertArticle = article => connection('articles')
  .insert(article)
  .returning('*'); */


const modifyVote = (article_id, votes) => connection('articles')
  .where('article_id', '=', article_id)
  .increment('votes', votes)
  .returning('*');

const removeArticle = article_id => connection('articles').where('article_id', article_id).del();

const fetchCommentsForArticle = (userQuery, article_id) => {
  const {
    limit = 10,
    p = 1,
    sort_by = 'c.created_at',
    order = 'desc',
  } = userQuery;

  const offset = ((p * limit) - limit);
  return connection
    .select('c.comment_id', 'c.votes', 'c.created_at', 'c.author', 'c.body')
    .from('comments as c')
    .where('c.article_id', article_id)
    .orderBy(sort_by, order)
    .offset(offset)
    .limit(limit);
};


/* replaced by generic
const insertCommentForArticle = commentObj => connection('comments')
  .insert(commentObj)
  .returning('*'); */

module.exports = {
  fetchAllArticles,
  getArticleCount,
  modifyVote,
  removeArticle,
  fetchCommentsForArticle,
  fetchAllArticleById,
  getCommentsForArticleCount,
};
