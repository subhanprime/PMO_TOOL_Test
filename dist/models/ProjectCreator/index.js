"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgdb_1 = require("../../db/pgdb");
const sequelize_1 = require("sequelize");
const ProjectCreator = pgdb_1.sequelize.define("ProjectCreator", {
    ProjectId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Projects",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
}, {
    tableName: "ProjectCreators",
    timestamps: true,
});
exports.default = ProjectCreator;
