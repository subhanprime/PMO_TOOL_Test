"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDepartments = exports.deleteDepartment = exports.departmentCreate = void 0;
const joi_1 = __importDefault(require("joi"));
const department_model_1 = __importDefault(require("../../models/department/department.model"));
const departmentCreate = async (req, res) => {
    try {
        const { name, description, isActive, managerName, color } = req.body;
        // Validate request body using express-validator
        const departmentSchema = joi_1.default.object({
            name: joi_1.default.string().trim().required().messages({
                "string.empty": "Name is required",
            }),
            description: joi_1.default.string().trim().allow("").optional(),
            isActive: joi_1.default.boolean().optional().default(true),
            color: joi_1.default.string().optional(),
        });
        const { error } = departmentSchema.validate(req.body);
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(", ");
            return res.status(400).json({ message: errorMessage });
        }
        // Check if the department name already exists
        const existingDepartment = await department_model_1.default.findOne({ where: { name } });
        if (existingDepartment) {
            return res
                .status(400)
                .json({ message: "Department name already exists" });
        }
        // Create a new department record
        const newDepartment = await department_model_1.default.create({
            name,
            description,
            isActive,
            managerName,
            color,
        });
        // Respond with the created department
        res.status(201).json(newDepartment);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Something went wrong",
            status: false,
        });
    }
};
exports.departmentCreate = departmentCreate;
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the department by ID
        const department = await department_model_1.default.findByPk(id);
        // Check if the department exists
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        // Delete the department
        await department.destroy();
        // Respond with success message
        res.json({ message: "Department deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteDepartment = deleteDepartment;
const getAllDepartments = async (req, res) => {
    try {
        // Fetch all departments from the database
        const departments = await department_model_1.default.findAll();
        // Respond with the array of departments
        res.status(200).json(departments);
    }
    catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllDepartments = getAllDepartments;
