import { Request, Response } from "express";
import Joi from "joi";
import Department from "../../models/department/department.model";

export const departmentCreate = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive, managerName, color } = req.body;

    // Validate request body using express-validator
    const departmentSchema = Joi.object({
      name: Joi.string().trim().required().messages({
        "string.empty": "Name is required",
      }),
      description: Joi.string().trim().allow("").optional(),
      isActive: Joi.boolean().optional().default(true),
      color: Joi.string().optional(),
    });

    const { error } = departmentSchema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ message: errorMessage });
    }

    // Check if the department name already exists
    const existingDepartment = await Department.findOne({ where: { name } });
    if (existingDepartment) {
      return res
        .status(400)
        .json({ message: "Department name already exists" });
    }

    // Create a new department record
    const newDepartment = await Department.create({
      name,
      description,
      isActive,
      managerName,
      color,
    });

    // Respond with the created department
    res.status(201).json(newDepartment);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Something went wrong",
      status: false,
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the department by ID
    const department = await Department.findByPk(id);

    // Check if the department exists
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Delete the department
    await department.destroy();

    // Respond with success message
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    // Fetch all departments from the database
    const departments = await Department.findAll();

    // Respond with the array of departments
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
