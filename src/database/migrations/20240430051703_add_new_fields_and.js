/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('users', function (table) {
        // Add new fields to the table
        table.string('avatar').notNullable;
        table.enu('account_status', ['pending', 'active', 'block']).defaultTo('pending').notNullable();
        table.renameColumn('firstname', 'firstName');
        table.renameColumn('lastname', 'lastName');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
