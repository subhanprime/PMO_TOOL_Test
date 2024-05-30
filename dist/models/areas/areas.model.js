"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb");
const Area = pgdb_1.sequelize.define("Area", {
    cityName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    areaName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    adminCode1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    countryCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    population: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    lat: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    lng: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    // Other model options go here
    tableName: "areas",
    timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt
});
exports.default = Area;
