import { DataTypes } from "sequelize";
import { sequelize } from "../../db/pgdb";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    full_name: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    hourly_rate: {
      // Newly added
      type: DataTypes.DECIMAL(10, 2), // Adjust precision as needed
      allowNull: true,
    },
    weekly_rate: {
      // Newly added
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monthly_rate: {
      // Newly added
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    contact_number: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergency_contact_number: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    passport_expiry: {
      // Newly added
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    date_of_birth: {
      // Newly added
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    visa_start_date: {
      // Newly added
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    visa_end_date: {
      // Newly added
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    passport_no: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    driving_license_number: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_name: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_joining: {
      // Newly added
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    city_name: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    area_name: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_type: {
      // Newly added
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },
    account_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "User",
    tableName: "users",
    timestamps: true, // Enable timestamps if not previously enabled
    // createdAt: "created_at", // Map createdAt to created_at in the database
    // updatedAt: "updated_at",
  }
);

export default User;
