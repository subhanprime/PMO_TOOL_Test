import Joi from "joi";
import Project from "../../models/projects";
import Logistics from "../../models/logistics/logistics.model";
import { Request, Response, NextFunction } from "express";
const logisticsSchema = Joi.object({
  category: Joi.string().required(),
  logistics_type: Joi.string().required(),
  total_quantity_required: Joi.number().integer().required(),
  planned_cost: Joi.number().precision(2).required(),
  responsible_person: Joi.string().required(),
  finish_timeline: Joi.date().required(),
  projectId: Joi.number().integer().required(),
  requirement_phase_1: Joi.string().optional().allow(null, ""),
  requirement_phase_2: Joi.string().optional().allow(null, ""),
  requirement_phase_3: Joi.string().optional().allow(null, ""),
  expected_supplier_1: Joi.string().optional().allow(null, ""),
  expected_supplier_2: Joi.string().optional().allow(null, ""),
  expected_supplier_3: Joi.string().optional().allow(null, ""),
});
export const createLogistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = logisticsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    category,
    logistics_type,
    total_quantity_required,
    planned_cost,
    responsible_person,
    finish_timeline,
    projectId,
    requirement_phase_1,
    requirement_phase_2,
    requirement_phase_3,
    expected_supplier_1,
    expected_supplier_2,
    expected_supplier_3,
  } = req.body;

  try {
    // Check if the associated project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Create a new logistics entry
    const logistics = await Logistics.create({
      category,
      logistics_type,
      total_quantity_required,
      planned_cost,
      responsible_person,
      finish_timeline,
      projectId,
      requirement_phase_1,
      requirement_phase_2,
      requirement_phase_3,
      expected_supplier_1,
      expected_supplier_2,
      expected_supplier_3,
    });

    return res.status(201).json(logistics);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the logistics entry" });
  }
};

export const getLogisticsByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params;

  try {
    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Retrieve all logistics entries for the project
    const logistics = await Logistics.findAll({ where: { projectId } });

    return res.status(200).json(logistics);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving logistics entries" });
  }
};

export const deleteLogistics = async (req: Request, res: Response) => {
  const { logisticsId } = req.params;

  try {
    // Check if the logistics entry exists
    const logistics = await Logistics.findByPk(logisticsId);
    if (!logistics) {
      return res.status(404).json({ error: "Logistics entry not found" });
    }

    // Delete the logistics entry
    await logistics.destroy();

    return res
      .status(200)
      .json({ message: "Logistics entry deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the logistics entry" });
  }
};

export const updateLogistics = async (req: Request, res: Response) => {
  const { logisticsId } = req.params;
  const { error } = logisticsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    category,
    logistics_type,
    total_quantity_required,
    planned_cost,
    responsible_person,
    finish_timeline,
    requirement_phase_1,
    requirement_phase_2,
    requirement_phase_3,
    expected_supplier_1,
    expected_supplier_2,
    expected_supplier_3,
  } = req.body;

  try {
    // Check if the logistics entry exists
    const logistics = await Logistics.findByPk(logisticsId);
    if (!logistics) {
      return res.status(404).json({ error: "Logistics entry not found" });
    }

    // Update the logistics entry (excluding projectId)
    await logistics.update({
      category,
      logistics_type,
      total_quantity_required,
      planned_cost,
      responsible_person,
      finish_timeline,
      requirement_phase_1,
      requirement_phase_2,
      requirement_phase_3,
      expected_supplier_1,
      expected_supplier_2,
      expected_supplier_3,
    });

    return res.status(200).json(logistics);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while updating the logistics entry" });
  }
};
