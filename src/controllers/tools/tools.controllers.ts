import { Request, Response, NextFunction } from "express";
import Tool from "../../models/tools/tools.models";
import Project from "../../models/projects";
import ProjectTools from "../../models/projectTools/projectTools.model";
import Joi from "joi";

const toolSchema = Joi.object({
  category: Joi.string().required(),
  tools: Joi.string().required(),
  toolImportance: Joi.string().required(),
  rentOrPurchase: Joi.string().valid("rent", "purchase").required(),
  toolTypes: Joi.string().allow(null, ""),
  requirementPhase1: Joi.string().allow(null, ""),
  requirementPhase2: Joi.string().allow(null, ""),
  requirementPhase3: Joi.string().allow(null, ""),
  quantity: Joi.number().integer().required(),
  responsiblePerson: Joi.string().required(),
  expectedSupplier1: Joi.string().allow(null, ""),
  expectedSupplier2: Joi.string().allow(null, ""),
  expectedSupplier3: Joi.string().allow(null, ""),
  plannedCost: Joi.number().precision(2).required(),
  finishTimeline: Joi.date().required(),
  projectId: Joi.number().integer().required(),
});

// Create a new tool
export const createTools = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { error, value } = toolSchema.validate({ ...req.body, projectId });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      category,
      tools,
      toolImportance,
      rentOrPurchase,
      toolTypes,
      requirementPhase1,
      requirementPhase2,
      requirementPhase3,
      quantity,
      responsiblePerson,
      expectedSupplier1,
      expectedSupplier2,
      expectedSupplier3,
      plannedCost,
      finishTimeline,
    } = value;

    // Ensure the project exists
    const project: any = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Upsert the tool
    const [tool, created] = await Tool.upsert(
      {
        category,
        tools,
        toolImportance,
        rentOrPurchase,
        toolTypes,
        requirementPhase1,
        requirementPhase2,
        requirementPhase3,
        quantity,
        responsiblePerson,
        expectedSupplier1,
        expectedSupplier2,
        expectedSupplier3,
        plannedCost,
        finishTimeline,
      },
      { returning: true }
    );

    // Associate the tool with the project
    await project.addTool(tool);

    return res.status(201).json({ tool, created });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the tool" });
  }
};

// get tools by project id
export const getToolsByProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const project: any = await Project.findByPk(projectId, {
      include: [
        {
          model: Tool,
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    console.log("project tools", project);
    return res.status(200).json(project.Tools);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};
// remove a tool from project
export const removeToolFromProject = async (req: Request, res: Response) => {
  const { projectId, toolId } = req.params;

  try {
    // Find the project and tool instances
    const project = await Project.findByPk(projectId);
    const tool = await Tool.findByPk(toolId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    // Remove the association between the project and the tool
    await ProjectTools.destroy({
      where: {
        ProjectId: projectId,
        ToolId: toolId,
      },
    });

    return res
      .status(200)
      .json({ message: "Tool removed from project successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

// Get all tools
export const getAllTools = async (req: Request, res: Response) => {
  try {
    // Extract page and limit from query parameters, default to 1 and 50 respectively
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const offset = (page - 1) * limit;

    // Retrieve tools from the database with pagination and limit
    const { count, rows } = await Tool.findAndCountAll({
      limit,
      offset,
    });

    // Create a map to store unique tool names
    const uniqueToolsMap = new Map<string, typeof Tool>();

    // Iterate over each tool and add it to the map (overwriting if already exists)
    rows.forEach((tool: any) => {
      uniqueToolsMap.set(tool.tools, tool);
    });

    // Convert the map values (tools) back to an array
    const uniqueTools = Array.from(uniqueToolsMap.values());

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    // Send the response with unique tools, pagination metadata, total pages, and current page
    return res.status(200).json({
      totalTools: count,
      totalPages,
      currentPage: page,
      tools: uniqueTools,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

// Get a tool by ID
export const getToolById = async (req: Request, res: Response) => {
  try {
    const tool = await Tool.findByPk(req.params.id);
    if (tool) {
      res.status(200).json(tool);
    } else {
      res.status(404).json({ message: "Tool not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a tool
export const updateTool = async (req: Request, res: Response) => {
  const { toolId } = req.params;
  const toolData = req.body;

  try {
    // Find the tool by its ID
    const tool = await Tool.findByPk(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    console.log("toolData", toolData);

    // Extract only the fields provided in the request body
    const updatedFields: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(toolData)) {
      // Check if the field exists in the Tool model
      if ((tool as any)[key] !== undefined) {
        updatedFields[key] = value;
      }
    }

    console.log("updatedFields", updatedFields);

    // Update the tool with the new values
    await tool.update(updatedFields);
    const tooling = await Tool.findByPk(toolId);

    return res
      .status(200)
      .json({ message: "Tool updated successfully", tool: tooling });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

// Delete a tool
export const deleteTool = async (req: Request, res: Response) => {
  try {
    const deleted = await Tool.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Tool not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
