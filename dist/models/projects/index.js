"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb"); // Assuming you have initialized Sequelize
const Project = pgdb_1.sequelize.define("Projects", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    client: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    deadline: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    scope: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    objective: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    deliverables: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Key_Stake_holders_internals: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    Key_Stake_holders_externals: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: "Projects",
    timestamps: true,
});
exports.default = Project;
