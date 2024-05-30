import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";

const Country = sequelize.define("Country", {
  countryName: {
    type: DataTypes.STRING,
    unique: true,
  },
  continent: DataTypes.STRING,
  capital: DataTypes.STRING,
  languages: DataTypes.STRING,
  geonameId: DataTypes.INTEGER,
  south: DataTypes.FLOAT,
  isoAlpha3: DataTypes.STRING,
  north: DataTypes.FLOAT,
  fipsCode: DataTypes.STRING,
  population: DataTypes.STRING,
  east: DataTypes.FLOAT,
  isoNumeric: DataTypes.STRING,
  areaInSqKm: DataTypes.STRING,
  countryCode: DataTypes.STRING,
  west: DataTypes.FLOAT,

  postalCodeFormat: DataTypes.STRING,
  continentName: DataTypes.STRING,
  currencyCode: DataTypes.STRING,
});

export default Country;
