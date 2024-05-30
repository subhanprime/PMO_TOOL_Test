"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb");
const City = pgdb_1.sequelize.define("City", {
    countryName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cityName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    asciiName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    countryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    countryCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    continentCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    toponymName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    population: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "cities", // specify the table's name
    timestamps: false, // assuming no need for timestamps
});
exports.default = City;
