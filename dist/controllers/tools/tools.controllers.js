"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTool = exports.updateTool = exports.getToolById = exports.getAllTools = exports.removeToolFromProject = exports.getToolsByProject = exports.createTools = void 0;
const tools_models_1 = __importDefault(require("../../models/tools/tools.models"));
const projects_1 = __importDefault(require("../../models/projects"));
const projectTools_model_1 = __importDefault(require("../../models/projectTools/projectTools.model"));
const joi_1 = __importDefault(require("joi"));
const toolSchema = joi_1.default.object({
    category: joi_1.default.string().required(),
    tools: joi_1.default.string().required(),
    toolImportance: joi_1.default.string().required(),
    rentOrPurchase: joi_1.default.string().valid("rent", "purchase").required(),
    toolTypes: joi_1.default.string().allow(null, ""),
    requirementPhase1: joi_1.default.string().allow(null, ""),
    requirementPhase2: joi_1.default.string().allow(null, ""),
    requirementPhase3: joi_1.default.string().allow(null, ""),
    quantity: joi_1.default.number().integer().required(),
    responsiblePerson: joi_1.default.string().required(),
    expectedSupplier1: joi_1.default.string().allow(null, ""),
    expectedSupplier2: joi_1.default.string().allow(null, ""),
    expectedSupplier3: joi_1.default.string().allow(null, ""),
    plannedCost: joi_1.default.number().precision(2).required(),
    finishTimeline: joi_1.default.date().required(),
    projectId: joi_1.default.number().integer().required(),
});
// Create a new tool
const createTools = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { error, value } = toolSchema.validate({ ...req.body, projectId });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { category, tools, toolImportance, rentOrPurchase, toolTypes, requirementPhase1, requirementPhase2, requirementPhase3, quantity, responsiblePerson, expectedSupplier1, expectedSupplier2, expectedSupplier3, plannedCost, finishTimeline, } = value;
        // Ensure the project exists
        const project = await projects_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Upsert the tool
        const [tool, created] = await tools_models_1.default.upsert({
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
        }, { returning: true });
        // Associate the tool with the project
        await project.addTool(tool);
        return res.status(201).json({ tool, created });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while creating the tool" });
    }
};
exports.createTools = createTools;
// get tools by project id
const getToolsByProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await projects_1.default.findByPk(projectId, {
            include: [
                {
                    model: tools_models_1.default,
                    through: { attributes: [] }, // Exclude the join table attributes
                },
            ],
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        console.log("project tools", project);
        return res.status(200).json(project.Tools);
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "An error occurred", error: err.message });
    }
};
exports.getToolsByProject = getToolsByProject;
// remove a tool from project
const removeToolFromProject = async (req, res) => {
    const { projectId, toolId } = req.params;
    try {
        // Find the project and tool instances
        const project = await projects_1.default.findByPk(projectId);
        const tool = await tools_models_1.default.findByPk(toolId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }
        // Remove the association between the project and the tool
        await projectTools_model_1.default.destroy({
            where: {
                ProjectId: projectId,
                ToolId: toolId,
            },
        });
        return res
            .status(200)
            .json({ message: "Tool removed from project successfully" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "An error occurred", error: err.message });
    }
};
exports.removeToolFromProject = removeToolFromProject;
// Get all tools
const getAllTools = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to 1 and 50 respectively
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const offset = (page - 1) * limit;
        // Retrieve tools from the database with pagination and limit
        const { count, rows } = await tools_models_1.default.findAndCountAll({
            limit,
            offset,
        });
        // Create a map to store unique tool names
        const uniqueToolsMap = new Map();
        // Iterate over each tool and add it to the map (overwriting if already exists)
        rows.forEach((tool) => {
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
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "An error occurred", error: err.message });
    }
};
exports.getAllTools = getAllTools;
// Get a tool by ID
const getToolById = async (req, res) => {
    try {
        const tool = await tools_models_1.default.findByPk(req.params.id);
        if (tool) {
            res.status(200).json(tool);
        }
        else {
            res.status(404).json({ message: "Tool not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getToolById = getToolById;
// Update a tool
const updateTool = async (req, res) => {
    const { toolId } = req.params;
    const toolData = req.body;
    try {
        // Find the tool by its ID
        const tool = await tools_models_1.default.findByPk(toolId);
        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }
        console.log("toolData", toolData);
        // Extract only the fields provided in the request body
        const updatedFields = {};
        for (const [key, value] of Object.entries(toolData)) {
            // Check if the field exists in the Tool model
            if (tool[key] !== undefined) {
                updatedFields[key] = value;
            }
        }
        console.log("updatedFields", updatedFields);
        // Update the tool with the new values
        await tool.update(updatedFields);
        const tooling = await tools_models_1.default.findByPk(toolId);
        return res
            .status(200)
            .json({ message: "Tool updated successfully", tool: tooling });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "An error occurred", error: err.message });
    }
};
exports.updateTool = updateTool;
// Delete a tool
const deleteTool = async (req, res) => {
    try {
        const deleted = await tools_models_1.default.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Tool not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteTool = deleteTool;
