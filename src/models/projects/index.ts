import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb"; // Assuming you have initialized Sequelize
import User from "../../models/users/users"; // Import the User model if not already imported

const Project = sequelize.define(
  "Projects",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliverables: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Key_Stake_holders_internals: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    Key_Stake_holders_externals: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Projects",
    timestamps: true,
  }
);

export default Project;
