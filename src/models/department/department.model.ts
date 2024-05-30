import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";

const Department = sequelize.define("Department", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default value to indicate department is active
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#0077b6",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Default value to set the current timestamp
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Default value to set the current timestamp
  },
});

export default Department;
