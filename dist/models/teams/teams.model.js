"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules and Sequelize
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb"); // Import Sequelize instance
// Extend Model and provide attributes and static methods
class Team extends sequelize_1.Model {
    id;
    name;
    description;
}
// Initialize the Team model with attribute definitions and options
Team.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: pgdb_1.sequelize, // Pass the Sequelize instance here
    modelName: "Team", // Model name
    tableName: "teams", // Table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
});
// Export the Team model
exports.default = Team;
