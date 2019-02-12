
exports.up = function (knex, Promise) {
  console.log('Creating articles table');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').notNullable().defaultTo(0);
    articlesTable.string('topic').notNullable().references('slug').inTable('topics'); 
    articlesTable.string('author').notNullable().references('username').inTable('users'); 
    articlesTable.datetime('created_at').defaultTo(new Date().toISOString());
  });
};

exports.down = function (knex, Promise) {
  console.log('Dropping articles table');
  return knex.schema.dropTable('articles');
};
