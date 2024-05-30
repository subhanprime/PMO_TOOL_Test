"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgdb_1 = require("../../db/pgdb");
const sequelize_1 = require("sequelize");
const ProjectTools = pgdb_1.sequelize.define("ProjectTools", {
    ProjectId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Projects",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    ToolId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "tools",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
}, {
    tableName: "ProjectTools",
    timestamps: true,
});
exports.default = ProjectTools;
