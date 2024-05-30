"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskType = exports.getAllTaskTypeNames = exports.createTaskType = void 0;
const taskType_model_1 = __importDefault(require("../../models/taskType/taskType.model"));
const joi_1 = __importDefault(require("joi"));
const taskTypeSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    description: joi_1.default.string().allow("").optional(),
});
const createTaskType = async (req, res) => {
    try {
        // Validate request body against the schema
        const { error, value } = taskTypeSchema.validate(req.body);
        if (error) {
            // If validation fails, return a 400 response with the error details
            return res.status(400).json({ message: error.details[0].message });
        }
        // Destructure validated value
        const { name, description } = value;
        const taskExist = await taskType_model_1.default.findOne({ where: { name } });
        if (taskExist) {
            return res
                .status(400)
                .json({ status: false, message: "TaskType Already Exist" });
        }
        // Create a new TaskType
        const taskType = await taskType_model_1.default.create({ name, description });
        // Send the response
        return res.status(201).json({ status: true, taskType });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createTaskType = createTaskType;
const getAllTaskTypeNames = async (req, res) => {
    try {
        // Retrieve all task type names using aggregate functions
        const taskTypes = await taskType_model_1.default.findAll({
            attributes: ["id", "name", "description"],
            raw: true,
        });
        // Extract the names from the result
        const taskTypeNames = taskTypes;
        // Send the response
        return res.status(200).json(taskTypeNames);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllTaskTypeNames = getAllTaskTypeNames;
const deleteTaskTypeSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
});
const deleteTaskType = async (req, res) => {
    try {
        // Validate request parameters against the schema
        const { error, value } = deleteTaskTypeSchema.validate(req.params);
        if (error) {
            // If validation fails, return a 400 response with the error details
            return res.status(400).json({ message: error.details[0].message });
        }
        // Destructure validated value
        const { id } = value;
        // Check if the TaskType with the given id exists
        const taskType = await taskType_model_1.default.findByPk(id);
        if (!taskType) {
            return res.status(404).json({ message: "TaskType not found" });
        }
        // Delete the TaskType
        await taskType.destroy();
        // Send the response
        return res.status(200).json({ message: "TaskType deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteTaskType = deleteTaskType;
