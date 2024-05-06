/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex('table_name').del()
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'user1', firstname: 'John', lastname: 'Doe', email: 'john@example.com', password: '$2a$12$dq29sGJfr7OaZ4T3vqKL2OyWrjjdIFDHhhfyy..X.AkXGu5ASc5vi' },
        { username: 'user2', firstname: 'Jane', lastname: 'Doe', email: 'jane@example.com', password: '$2a$12$dq29sGJfr7OaZ4T3vqKL2OyWrjjdIFDHhhfyy..X.AkXGu5ASc5vi' },
        // Add more dummy data as needed
      ]);
    });
};
