"use strict";

import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb"; // Assuming you have initialized Sequelize

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  creater_name: {
    type: DataTypes.STRING,
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
  Deliverables: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Key_Stake_holders_internals: {
    type: DataTypes.STRING,
  },
  Key_Stake_holders_externals: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Project;
