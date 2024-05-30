"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditUserInfo = exports.userInfo = exports.getAllUsers = exports.createUser = void 0;
const customError_1 = __importDefault(require("../../Errors/customError"));
const validations_1 = require("../../constant/enums/validations");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const users_1 = __importDefault(require("../../models/users/users"));
const joi_1 = __importDefault(require("joi"));
const sequelize_1 = require("sequelize");
function generateRandomPassword() {
    // Generate 2 bytes of secure random data (16 bits)
    const randomBytes = crypto_1.default.randomBytes(2);
    // Convert the random bytes to a number (16-bit integer)
    const randomNumber = randomBytes.readUInt16LE(0);
    // Generate a 5-digit password from the random number (ensure leading zeros if needed)
    const password = randomNumber.toString().padStart(5, "0");
    return password;
}
const userSchema = joi_1.default.object({
    firstname: joi_1.default.string().optional,
    lastname: joi_1.default.string().optional,
    username: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    department: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    full_name: joi_1.default.string().required(),
    nationality: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    hourly_rate: joi_1.default.number().required(),
    weekly_rate: joi_1.default.number().required(),
    monthly_rate: joi_1.default.number().required(),
    contact_number: joi_1.default.string().required(),
    emergency_contact_number: joi_1.default.string().required(),
    passport_expiry: joi_1.default.date().iso().required(),
    date_of_birth: joi_1.default.date().iso().required(),
    visa_start_date: joi_1.default.date().iso().required(),
    visa_end_date: joi_1.default.date().iso().required(),
    passport_no: joi_1.default.string().required(),
    date_of_joining: joi_1.default.date().iso().required(),
    region: joi_1.default.string().required(),
    driving_license_number: joi_1.default.string().required(),
    country_name: joi_1.default.string().required(),
    city_name: joi_1.default.string().required(),
    area_name: joi_1.default.string().required(),
    user_type: joi_1.default.string().required(),
});
const createUser = async (req, res, next) => {
    try {
        // Validate request body against Joi schema
        const { error, value } = userSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ message: error.details.map((detail) => detail.message) });
        }
        // Destructure validated values from the request body
        const { firstname, lastname, username, role, department, email, password, full_name, nationality, address, hourly_rate, weekly_rate, monthly_rate, contact_number, emergency_contact_number, passport_expiry, date_of_birth, visa_start_date, visa_end_date, passport_no, date_of_joining, region, driving_license_number, country_name, city_name, area_name, user_type, } = value;
        const existingUser = await users_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
            },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username or email already exists" });
        }
        // Generate hashed password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user in the database
        const newUser = await users_1.default.create({
            firstname,
            lastname,
            username,
            role,
            department,
            email,
            password: hashedPassword,
            full_name,
            nationality,
            address,
            hourly_rate,
            weekly_rate,
            monthly_rate,
            contact_number,
            emergency_contact_number,
            passport_expiry,
            date_of_birth,
            visa_start_date,
            visa_end_date,
            passport_no,
            date_of_joining,
            region,
            driving_license_number,
            country_name,
            city_name,
            area_name,
            user_type,
        });
        // Send response
        res
            .status(201)
            .json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createUser = createUser;
const getAllUsers = async (req, res, next) => {
    try {
        const { page = "1" } = req.query; // Get the page number from the query parameters (default to '1' if not provided)
        const pageNumber = parseInt(page, 10) || 1; // Parse the page number to a numeric value (default to 1)
        const limit = 10; // Number of records per page
        const offset = (pageNumber - 1) * limit; // Calculate offset based on page number
        // Query users with pagination using Sequelize
        const { count, rows } = await users_1.default.findAndCountAll({
            attributes: [
                "firstname",
                "lastname",
                "username",
                "role",
                "department",
                "email",
                "full_name",
                "nationality",
                "address",
                "hourly_rate",
                "weekly_rate",
                "monthly_rate",
                "contact_number",
                "emergency_contact_number",
                "passport_expiry",
                "date_of_birth",
                "visa_start_date",
                "visa_end_date",
                "passport_no",
                "date_of_joining",
                "region",
                "driving_license_number",
                "country_name",
                "city_name",
                "area_name",
                "user_type",
            ],
            limit,
            offset,
        });
        const totalUsers = count;
        const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json({
            message: "Users fetched successfully",
            data: rows,
            pageInfo: {
                totalUsers,
                totalPages,
                currentPage: pageNumber,
            },
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users", error });
    }
};
exports.getAllUsers = getAllUsers;
const userInfo = async (req, res, next) => {
    try {
        const { email } = req.params; // Get the email address from the request parameters
        // Query the user by email using Sequelize
        const user = await users_1.default.findOne({
            where: { email }, // Find user where email matches
            attributes: [
                "id",
                "firstname",
                "lastname",
                "username",
                "role",
                "department",
                "email",
                "full_name",
                "nationality",
                "address",
                "hourly_rate",
                "weekly_rate",
                "monthly_rate",
                "contact_number",
                "emergency_contact_number",
                "passport_expiry",
                "date_of_birth",
                "visa_start_date",
                "visa_end_date",
                "passport_no",
                "date_of_joining",
                "region",
                "driving_license_number",
                "country_name",
                "city_name",
                "area_name",
                "user_type",
            ],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User found", data: user });
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ message: "Failed to fetch user", error });
    }
};
exports.userInfo = userInfo;
const EditUserInfo = async (req, res, next) => {
    try {
        const { email, firstname, lastname, username, role, department } = req.body;
        if (!email) {
            return next(new customError_1.default(validations_1.VALIDATIONS.PROVIDE_CREDENTIALS, 401));
        }
        const updateData = {};
        if (username)
            updateData.username = username;
        if (firstname)
            updateData.firstname = firstname;
        if (lastname)
            updateData.lastname = lastname;
        if (role)
            updateData.role = role;
        if (department)
            updateData.department = department;
        const [updated] = await users_1.default.update(updateData, {
            where: { email },
            returning: true,
        });
        if (updated) {
            const updatedUser = await users_1.default.findOne({ where: { email } });
            res.json(updatedUser);
        }
        else {
            return next(new customError_1.default(validations_1.VALIDATIONS.NOT_VALID_EMAIL, 401));
        }
    }
    catch (err) {
        console.error("Error updating user info:", err);
        return res.status(400).send(validations_1.GENERAL_ERROR.WENT_WRONG);
    }
};
exports.EditUserInfo = EditUserInfo;
