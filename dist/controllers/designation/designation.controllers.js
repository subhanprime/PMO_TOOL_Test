"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDesignations = exports.designationDelete = exports.designationCreate = void 0;
const joi_1 = __importDefault(require("joi"));
const designation_model_1 = __importDefault(require("../../models/designation/designation.model"));
const designationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required",
    }),
    description: joi_1.default.string().trim().allow("").optional(),
    color: joi_1.default.string().trim().optional(),
    level: joi_1.default.number().integer().optional().messages({
        "number.integer": "Level must be an integer",
    }),
});
const designationCreate = async (req, res) => {
    try {
        const { name, description, level, color } = req.body;
        // Validate request body using express-validator
        const { error } = designationSchema.validate(req.body);
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(", ");
            return res.status(400).json({ message: errorMessage });
        }
        // Check if the designation name already exists
        const existingDesignation = await designation_model_1.default.findOne({ where: { name } });
        if (existingDesignation) {
            return res
                .status(400)
                .json({ message: "Designation name already exists" });
        }
        // Create a new designation record
        const newDesignation = await designation_model_1.default.create({
            name,
            description,
            level,
            color
        });
        // Respond with the created designation
        res.status(201).json(newDesignation);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Something went wrong", status: false });
    }
};
exports.designationCreate = designationCreate;
const designationDelete = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the designation by ID
        const designation = await designation_model_1.default.findByPk(id);
        // Check if the designation exists
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }
        // Delete the designation
        await designation.destroy();
        // Respond with success message
        res.json({ message: "Designation deleted successfully", status: true });
    }
    catch (err) {
        console.error("Error deleting designation:", err);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
};
exports.designationDelete = designationDelete;
const getAllDesignations = async (req, res) => {
    try {
        // Fetch all designations from the database
        const designations = await designation_model_1.default.findAll({
            attributes: ["id", "name", "level", "description"], // Specify the fields to retrieve
        });
        // Respond with the array of designations
        res.status(200).json(designations);
    }
    catch (err) {
        console.error("Error fetching designations:", err);
        res.status(500).json({ message: "Internal Server Error", status: false });
    }
};
exports.getAllDesignations = getAllDesignations;
