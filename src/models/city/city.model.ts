import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";
const City = sequelize.define(
  "City",
  {
    countryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asciiName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    continentCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toponymName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    population: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "cities", // specify the table's name
    timestamps: false, // assuming no need for timestamps
  }
);

export default City;
