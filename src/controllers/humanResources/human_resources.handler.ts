import Joi from "joi";
import { Request, Response } from "express";
import Project from "../../models/projects";
import HumanResources from "../../models/human_Resources/index.model";

const projectHumanResourcesSchema = Joi.object({
  name: Joi.string().required(),
  projectId: Joi.number().required(),
  designation: Joi.string().required(),
  client: Joi.string().required(),
  industry: Joi.string().required(),
  skill_required: Joi.string().required(),
  qualification_required: Joi.string().required(),
  responsible: Joi.string().required(),
  planned_salary: Joi.number().required(),
  percentage_usage: Joi.number().required(),
  planned_hr_expense: Joi.number().required(),
  status: Joi.string().required(),
});

export const addHumanResourceToProject = async (
  req: Request,
  res: Response
) => {
  //   const { projectId } = req.params;
  const { error, value } = projectHumanResourcesSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const humanResourceData = req.body;

  try {
    // Check if the project exists
    const project: any = await Project.findByPk(value.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Create human resource for the project
    const createdHumanResource = await HumanResources.create({
      ...humanResourceData,
      //   projectId:val, // Assign projectId to the human resource
    });

    // Associate the created human resource with the project
    await project.addHumanResource(createdHumanResource);

    return res.status(201).json({
      message: "Human resource added to the project successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error adding human resource to project:", error);
    return res.status(500).json({
      error: "An error occurred while adding human resource to the project",
    });
  }
};

export const getAllResourcesOfProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Retrieve all resources associated with the project
    const resources = await HumanResources.findAll({ where: { projectId } });

    return res.status(200).json({ resources, status: true });
  } catch (error) {
    console.error("Error fetching resources of project:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching resources of project" });
  }
};

export const deleteHumanResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  try {
    // Check if the resource exists
    const resource = await HumanResources.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Delete the resource
    await resource.destroy();

    return res
      .status(200)
      .json({ message: "Resource deleted successfully", status: true });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting resource" });
  }
};

export const updateHumanResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;
  const { projectId, ...updatedData } = req.body; // Exclude projectId from updated data

  try {
    // Check if the resource exists
    let resource = await HumanResources.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Update the resource (excluding projectId)
    await resource.update(updatedData);

    // Fetch the updated resource with associated data
    resource = await HumanResources.findByPk(resourceId);

    return res.status(200).json(resource);
  } catch (error) {
    console.error("Error updating resource:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating resource" });
  }
};
