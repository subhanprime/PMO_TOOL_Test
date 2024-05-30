"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb");
const Country = pgdb_1.sequelize.define("Country", {
    countryName: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    continent: sequelize_1.DataTypes.STRING,
    capital: sequelize_1.DataTypes.STRING,
    languages: sequelize_1.DataTypes.STRING,
    geonameId: sequelize_1.DataTypes.INTEGER,
    south: sequelize_1.DataTypes.FLOAT,
    isoAlpha3: sequelize_1.DataTypes.STRING,
    north: sequelize_1.DataTypes.FLOAT,
    fipsCode: sequelize_1.DataTypes.STRING,
    population: sequelize_1.DataTypes.STRING,
    east: sequelize_1.DataTypes.FLOAT,
    isoNumeric: sequelize_1.DataTypes.STRING,
    areaInSqKm: sequelize_1.DataTypes.STRING,
    countryCode: sequelize_1.DataTypes.STRING,
    west: sequelize_1.DataTypes.FLOAT,
    postalCodeFormat: sequelize_1.DataTypes.STRING,
    continentName: sequelize_1.DataTypes.STRING,
    currencyCode: sequelize_1.DataTypes.STRING,
});
exports.default = Country;
