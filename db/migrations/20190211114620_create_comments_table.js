
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').notNullable().references('username').inTable('users'); // ref username in users
    commentsTable.integer('article_id').notNullable().references('article_id').inTable('articles').onDelete('CASCADE'); // ref article_id in articles
    commentsTable.integer('votes').notNullable().defaultTo(0);
    commentsTable.datetime('created_at').defaultTo(new Date().toISOString());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
