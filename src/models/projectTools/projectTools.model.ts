import { sequelize } from "../../db/pgdb";
import { DataTypes } from "sequelize";

const ProjectTools = sequelize.define(
  "ProjectTools",
  {
    ProjectId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Projects",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    ToolId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tools",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "ProjectTools",
    timestamps: true,
  }
);

export default ProjectTools;
