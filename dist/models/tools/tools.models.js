"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgdb_1 = require("../../db/pgdb");
const sequelize_1 = require("sequelize");
const Tool = pgdb_1.sequelize.define("Tool", {
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tools: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    toolImportance: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rentOrPurchase: {
        type: sequelize_1.DataTypes.ENUM("rent", "purchase"),
        allowNull: false,
    },
    toolTypes: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    requirementPhase1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    requirementPhase2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    requirementPhase3: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    responsiblePerson: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expectedSupplier1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    expectedSupplier2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    expectedSupplier3: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    plannedCost: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    finishTimeline: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: "tools",
    timestamps: true,
});
exports.default = Tool;
