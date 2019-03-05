
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary().notNullable();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').notNullable().defaultTo(0);
    articlesTable.string('topic').notNullable().references('slug').inTable('topics');
    articlesTable.string('author').notNullable().references('username').inTable('users');
    articlesTable.datetime('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
