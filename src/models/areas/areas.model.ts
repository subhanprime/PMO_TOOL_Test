import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";
const Area = sequelize.define(
  "Area",
  {
    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminCode1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    tableName: "areas",
    timestamps: false, // Set to true if you want Sequelize to handle createdAt and updatedAt
  }
);

export default Area;
