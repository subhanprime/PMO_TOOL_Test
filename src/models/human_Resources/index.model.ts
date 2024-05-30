// models/humanResources.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../database/connection');
import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";
const HumanResources = sequelize.define("HumanResources", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skill_required: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qualification_required: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsible: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  planned_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  percentage_usage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  planned_hr_expense: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default HumanResources;
