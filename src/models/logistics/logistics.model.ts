// const { DataTypes } = require('sequelize');
// const sequelize = require('./index'); // Adjust the path as needed

import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";

const Logistics = sequelize.define(
  "Logistics",
  {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logistics_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_quantity_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    planned_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    responsible_person: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    finish_timeline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    requirement_phase_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirement_phase_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirement_phase_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expected_supplier_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expected_supplier_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expected_supplier_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "logistics",
    timestamps: false,
  }
);

export default Logistics;
