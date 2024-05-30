import { NextFunction, Request, Response } from "express";
import CustomError from "../../Errors/customError";
import { VALIDATIONS, GENERAL_ERROR } from "../../constant/enums/validations";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { sequelize } from "../../db/pgdb";
import User from "../../models/users/users";
import Joi from "joi";
import { Op } from "sequelize";

function generateRandomPassword() {
  // Generate 2 bytes of secure random data (16 bits)
  const randomBytes = crypto.randomBytes(2);

  // Convert the random bytes to a number (16-bit integer)
  const randomNumber = randomBytes.readUInt16LE(0);

  // Generate a 5-digit password from the random number (ensure leading zeros if needed)
  const password = randomNumber.toString().padStart(5, "0");

  return password;
}

const userSchema = Joi.object({
  firstname: Joi.string().optional,
  lastname: Joi.string().optional,
  username: Joi.string().required(),
  role: Joi.string().required(),
  department: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  full_name: Joi.string().required(),
  nationality: Joi.string().required(),
  address: Joi.string().required(),
  hourly_rate: Joi.number().required(),
  weekly_rate: Joi.number().required(),
  monthly_rate: Joi.number().required(),
  contact_number: Joi.string().required(),
  emergency_contact_number: Joi.string().required(),
  passport_expiry: Joi.date().iso().required(),
  date_of_birth: Joi.date().iso().required(),
  visa_start_date: Joi.date().iso().required(),
  visa_end_date: Joi.date().iso().required(),
  passport_no: Joi.string().required(),
  date_of_joining: Joi.date().iso().required(),
  region: Joi.string().required(),
  driving_license_number: Joi.string().required(),
  country_name: Joi.string().required(),
  city_name: Joi.string().required(),
  area_name: Joi.string().required(),
  user_type: Joi.string().required(),
});

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const {
      firstname,
      lastname,
      username,
      role,
      department,
      email,
      password,
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
    } = value;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Generate hashed password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in the database
    const newUser = await User.create({
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
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1" } = req.query; // Get the page number from the query parameters (default to '1' if not provided)
    const pageNumber = parseInt(page as string, 10) || 1; // Parse the page number to a numeric value (default to 1)

    const limit = 10; // Number of records per page
    const offset = (pageNumber - 1) * limit; // Calculate offset based on page number

    // Query users with pagination using Sequelize
    const { count, rows } = await User.findAndCountAll({
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
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const userInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params; // Get the email address from the request parameters

    // Query the user by email using Sequelize
    const user = await User.findOne({
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
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};

export const EditUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstname, lastname, username, role, department } = req.body;

    if (!email) {
      return next(new CustomError(VALIDATIONS.PROVIDE_CREDENTIALS, 401));
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (role) updateData.role = role;
    if (department) updateData.department = department;

    const [updated] = await User.update(updateData, {
      where: { email },
      returning: true,
    });

    if (updated) {
      const updatedUser = await User.findOne({ where: { email } });
      res.json(updatedUser);
    } else {
      return next(new CustomError(VALIDATIONS.NOT_VALID_EMAIL, 401));
    }
  } catch (err) {
    console.error("Error updating user info:", err);

    return res.status(400).send(GENERAL_ERROR.WENT_WRONG);
  }
};
