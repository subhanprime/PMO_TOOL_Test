import { sequelize } from "../../db/pgdb";
import { DataTypes } from "sequelize";

const ProjectCreator = sequelize.define(
  "ProjectCreator",
  {
    ProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "ProjectCreators",
    timestamps: true,
  }
);

export default ProjectCreator;
