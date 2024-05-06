module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '12345',
      database: 'node_postgre',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations', // Path to your migrations directory
    },
    seeds: {
      directory: './src/database/seeds', // Path to your seeds directory
    },
  },
};
