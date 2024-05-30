import { sequelize } from "../../db/pgdb";
import { DataTypes } from "sequelize";

const Designation = sequelize.define("Designation", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // You can set allowNull to false if description is required
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true, // You can set allowNull to false if level is required
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#2a9d8f",
  },
});

export default Designation;
