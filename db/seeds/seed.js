const {
  articleData, topicData, userData, commentData,
} = require('../data/index');

const { convertFromEpoch, formatArticles } = require('../utils/index');

exports.seed = function (knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => Promise.all([knex('users').insert(userData).returning('*'), knex('topics').insert(topicData).returning('*')]))
    .then(([userRows, topicRows]) => {
      console.log(`User rows length: ${userRows.length} , topic rows length: ${topicRows.length}`);
      const formattedArticles = formatArticles(articleData);
      const articlesRows = knex('articles')
        .insert(formattedArticles)
        .returning('*');
      return Promise.all([userRows, topicRows, articlesRows]);
    })
    .catch(error => console.log(error));
};
