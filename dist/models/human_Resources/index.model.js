"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/humanResources.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../database/connection');
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb");
const HumanResources = pgdb_1.sequelize.define("HumanResources", {
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    designation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    client: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    industry: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    skill_required: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    qualification_required: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    responsible: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    planned_salary: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    percentage_usage: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    planned_hr_expense: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.default = HumanResources;
