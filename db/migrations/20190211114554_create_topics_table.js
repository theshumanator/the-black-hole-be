
exports.up = function (knex, Promise) {
  console.log('Creating topics table');
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary();
    topicsTable.string('description');
  });
};

exports.down = function (knex, Promise) {
  console.log('Dropping topics table');
  return knex.schema.dropTable('topics');
};
