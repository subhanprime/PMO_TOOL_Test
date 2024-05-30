import { Request, Response } from "express";
import Joi from "joi";
import Designation from "../../models/designation/designation.model";

const designationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  description: Joi.string().trim().allow("").optional(),
  color: Joi.string().trim().optional(),
  level: Joi.number().integer().optional().messages({
    "number.integer": "Level must be an integer",
  }),
});

export const designationCreate = async (req: Request, res: Response) => {
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
    const existingDesignation = await Designation.findOne({ where: { name } });

    if (existingDesignation) {
      return res
        .status(400)
        .json({ message: "Designation name already exists" });
    }

    // Create a new designation record
    const newDesignation = await Designation.create({
      name,
      description,
      level,
      color
    });

    // Respond with the created designation
    res.status(201).json(newDesignation);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", status: false });
  }
};

export const designationDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the designation by ID
    const designation = await Designation.findByPk(id);

    // Check if the designation exists
    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    // Delete the designation
    await designation.destroy();

    // Respond with success message
    res.json({ message: "Designation deleted successfully", status: true });
  } catch (err) {
    console.error("Error deleting designation:", err);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

export const getAllDesignations = async (req: Request, res: Response) => {
  try {
    // Fetch all designations from the database
    const designations = await Designation.findAll({
      attributes: ["id", "name", "level", "description"], // Specify the fields to retrieve
    });
    // Respond with the array of designations
    res.status(200).json(designations);
  } catch (err) {
    console.error("Error fetching designations:", err);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};
