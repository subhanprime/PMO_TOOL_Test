// Import necessary modules and Sequelize
import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../db/pgdb"; // Import Sequelize instance

// Define interface for model attributes
interface TeamAttributes {
  id: number;
  name: string;
  description?: string;
}

// Extend Model and provide attributes and static methods
class Team extends Model<TeamAttributes> implements TeamAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  // Optional: Define static methods or associations here
}

// Initialize the Team model with attribute definitions and options
Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass the Sequelize instance here
    modelName: "Team", // Model name
    tableName: "teams", // Table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
  }
);

// Export the Team model
export default Team;
