"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgdb_1 = require("../../db/pgdb");
const sequelize_1 = require("sequelize");
const Tasks = pgdb_1.sequelize.define("Tasks", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
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
    end_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.ENUM("Minor", "Major", "Critical", "Blocker"),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Todo", "InReview", "InProgress", "Done"),
        allowNull: false,
    },
    attachment: {
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
    creatorId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    },
    assignedToId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    },
    taskTypeId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "TaskType",
            key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    },
    projectId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Projects",
            key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    },
}, {
    tableName: "Tasks",
    timestamps: true,
});
exports.default = Tasks;
