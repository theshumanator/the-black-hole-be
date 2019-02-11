
exports.up = function (knex, Promise) {
  console.log('Creating articles table');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.string('body').notNullable(); // or text??
    articlesTable.string('votes').notNullable().defaultTo(0);
    articlesTable.string('topic').notNullable().references('slug').inTable('topics'); // ref slug in topics
    articlesTable.string('author').notNullable().references('username').inTable('users'); // ref username in users
    articlesTable.datetime('created_at').notNullable();
  });
};

exports.down = function (knex, Promise) {
  console.log('Dropping articles table');
  return knex.schema.dropTable('articles');
};
