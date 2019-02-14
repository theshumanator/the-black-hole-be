const connection = require('../db/connection');

const isValidSort = (sortBy) => {
  const validArticleSort = ['article_id', 'title', 'topic', 'votes', 'author', 'created_at'];
  return validArticleSort.includes(sortBy);
};

const isValidOrder = (order) => {
  const validOrder = ['asc', 'desc'];
  return validOrder.includes(order);
};

const fetchAllArticles = (userQuery, retry = false) => {
  const limit = userQuery.limit || 10;
  const p = userQuery.p || 1;
  let sort_by = userQuery.sort_by || 'a.created_at';
  let order = userQuery.order || 'desc';


  const whereQuery = {};
  // if it is a retry, dont include anything in the where clause
  if (!retry) {
    // TODO destrcture using reduce??
    if ('author' in userQuery) {
      whereQuery['a.author'] = userQuery.author;
    }
    if ('topic' in userQuery) {
      whereQuery['a.topic'] = userQuery.topic;
    }
    if ('article_id' in userQuery) {
      whereQuery['a.article_id'] = userQuery.article_id;
    }
  }


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

  const whereQuery = { };
  if ('author' in userQuery) {
    whereQuery['a.author'] = userQuery.author;
  }
  if ('topic' in userQuery) {
    whereQuery['a.topic'] = userQuery.topic;
  }
  if ('article_id' in userQuery) {
    whereQuery['a.article_id'] = userQuery.article_id;
  }


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
    .from('articles as a')
    .count('a.article_id as total_count')
    .where(newWhereQuery);
};

const insertArticle = article => connection('articles')
  .insert(article)
  .returning('*');


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

const insertCommentForArticle = commentObj => connection('comments')
  .insert(commentObj)
  .returning('*');

module.exports = {
  fetchAllArticles,
  getArticleCount,
  insertArticle,
  modifyVote,
  removeArticle,
  fetchCommentsForArticle,
  insertCommentForArticle,
  fetchAllArticleById,
};
