import { sequelize } from "../../db/pgdb";
import { DataTypes } from "sequelize";

const Tool = sequelize.define(
  "Tool",
  {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tools: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toolImportance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rentOrPurchase: {
      type: DataTypes.ENUM("rent", "purchase"),
      allowNull: false,
    },
    toolTypes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirementPhase1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirementPhase2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirementPhase3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responsiblePerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expectedSupplier1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expectedSupplier2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expectedSupplier3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plannedCost: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    finishTimeline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "tools",
    timestamps: true,
  }
);

export default Tool;
