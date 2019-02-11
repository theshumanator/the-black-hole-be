const {
  articleData, topicData, userData, commentData,
} = require('../data/index');

const { formatArticles, formatComments, getArticleIds } = require('../utils/index');

exports.seed = function (knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => Promise.all([knex('users').insert(userData).returning('*'), knex('topics').insert(topicData).returning('*')]))
    .then(([userRows, topicRows]) => {
      const formattedArticles = formatArticles(articleData);
      const articlesRows = knex('articles')
        .insert(formattedArticles)
        .returning('*');
      return Promise.all([userRows, topicRows, articlesRows]);
    })
    .then(([userRows, topicRows, articlesRows]) => {
      const articleIdList = getArticleIds(articlesRows);
      const formattedComments = formatComments(commentData, articleIdList);
      const commentsRows = knex('comments')
        .insert(formattedComments)
        .returning('*');
      return Promise.all([userRows, topicRows, articlesRows, commentsRows]);
    })
    .catch(error => console.log(error));
};
