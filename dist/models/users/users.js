"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const pgdb_1 = require("../../db/pgdb");
const User = pgdb_1.sequelize.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
    },
    full_name: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nationality: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    address: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    hourly_rate: {
        // Newly added
        type: sequelize_1.DataTypes.DECIMAL(10, 2), // Adjust precision as needed
        allowNull: true,
    },
    weekly_rate: {
        // Newly added
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    monthly_rate: {
        // Newly added
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    contact_number: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    emergency_contact_number: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    passport_expiry: {
        // Newly added
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    date_of_birth: {
        // Newly added
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    visa_start_date: {
        // Newly added
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    visa_end_date: {
        // Newly added
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    passport_no: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    region: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    driving_license_number: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    country_name: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_of_joining: {
        // Newly added
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    city_name: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    area_name: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    user_type: {
        // Newly added
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    refresh_token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    active_token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    account_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: "pending",
    },
    account_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    modelName: "User",
    tableName: "users",
    timestamps: true, // Enable timestamps if not previously enabled
    // createdAt: "created_at", // Map createdAt to created_at in the database
    // updatedAt: "updated_at",
});
exports.default = User;
