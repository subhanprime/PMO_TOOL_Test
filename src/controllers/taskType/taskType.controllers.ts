import { Request, Response, NextFunction } from "express";
import TaskType from "../../models/taskType/taskType.model";
import { Sequelize } from "sequelize";
import Joi from "joi";

const taskTypeSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow("").optional(),
});

export const createTaskType = async (req: Request, res: Response) => {
  try {
    // Validate request body against the schema
    const { error, value } = taskTypeSchema.validate(req.body);

    if (error) {
      // If validation fails, return a 400 response with the error details
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure validated value
    const { name, description } = value;

    const taskExist = await TaskType.findOne({ where: { name } });
    if (taskExist) {
      return res
        .status(400)
        .json({ status: false, message: "TaskType Already Exist" });
    }

    // Create a new TaskType
    const taskType = await TaskType.create({ name, description });

    // Send the response
    return res.status(201).json({ status: true, taskType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTaskTypeNames = async (req: Request, res: Response) => {
  try {
    // Retrieve all task type names using aggregate functions
    const taskTypes = await TaskType.findAll({
      attributes: ["id", "name", "description"],
      raw: true,
    });

    // Extract the names from the result
    const taskTypeNames = taskTypes;

    // Send the response
    return res.status(200).json(taskTypeNames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTaskTypeSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const deleteTaskType = async (req: Request, res: Response) => {
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
    const taskType = await TaskType.findByPk(id);
    if (!taskType) {
      return res.status(404).json({ message: "TaskType not found" });
    }

    // Delete the TaskType
    await taskType.destroy();

    // Send the response
    return res.status(200).json({ message: "TaskType deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
