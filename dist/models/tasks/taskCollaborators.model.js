"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgdb_1 = require("../../db/pgdb");
const sequelize_1 = require("sequelize");
const TaskCollaborators = pgdb_1.sequelize.define("TaskCollaborators", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    taskId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: pgdb_1.sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: pgdb_1.sequelize.literal("CURRENT_TIMESTAMP"),
    },
}, {
    timestamps: true,
});
exports.default = TaskCollaborators;
