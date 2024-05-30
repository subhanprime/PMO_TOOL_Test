"use strict";
// const { DataTypes } = require('sequelize');
// const sequelize = require('./index'); // Adjust the path as needed
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb");
const Logistics = pgdb_1.sequelize.define("Logistics", {
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    logistics_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    total_quantity_required: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    planned_cost: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    responsible_person: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    finish_timeline: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    requirement_phase_1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    requirement_phase_2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    requirement_phase_3: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    expected_supplier_1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    expected_supplier_2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    expected_supplier_3: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "logistics",
    timestamps: false,
});
exports.default = Logistics;
