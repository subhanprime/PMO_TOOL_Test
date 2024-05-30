"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgdb_1 = require("../../db/pgdb");
const sequelize_1 = require("sequelize");
const Designation = pgdb_1.sequelize.define("Designation", {
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // You can set allowNull to false if description is required
    },
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true, // You can set allowNull to false if level is required
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "#2a9d8f",
    },
});
exports.default = Designation;
