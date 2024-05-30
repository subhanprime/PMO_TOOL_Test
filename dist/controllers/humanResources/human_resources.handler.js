"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHumanResource = exports.deleteHumanResource = exports.getAllResourcesOfProject = exports.addHumanResourceToProject = void 0;
const joi_1 = __importDefault(require("joi"));
const projects_1 = __importDefault(require("../../models/projects"));
const index_model_1 = __importDefault(require("../../models/human_Resources/index.model"));
const projectHumanResourcesSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    projectId: joi_1.default.number().required(),
    designation: joi_1.default.string().required(),
    client: joi_1.default.string().required(),
    industry: joi_1.default.string().required(),
    skill_required: joi_1.default.string().required(),
    qualification_required: joi_1.default.string().required(),
    responsible: joi_1.default.string().required(),
    planned_salary: joi_1.default.number().required(),
    percentage_usage: joi_1.default.number().required(),
    planned_hr_expense: joi_1.default.number().required(),
    status: joi_1.default.string().required(),
});
const addHumanResourceToProject = async (req, res) => {
    //   const { projectId } = req.params;
    const { error, value } = projectHumanResourcesSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const humanResourceData = req.body;
    try {
        // Check if the project exists
        const project = await projects_1.default.findByPk(value.projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Create human resource for the project
        const createdHumanResource = await index_model_1.default.create({
            ...humanResourceData,
            //   projectId:val, // Assign projectId to the human resource
        });
        // Associate the created human resource with the project
        await project.addHumanResource(createdHumanResource);
        return res.status(201).json({
            message: "Human resource added to the project successfully",
            status: true,
        });
    }
    catch (error) {
        console.error("Error adding human resource to project:", error);
        return res.status(500).json({
            error: "An error occurred while adding human resource to the project",
        });
    }
};
exports.addHumanResourceToProject = addHumanResourceToProject;
const getAllResourcesOfProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        // Check if the project exists
        const project = await projects_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        // Retrieve all resources associated with the project
        const resources = await index_model_1.default.findAll({ where: { projectId } });
        return res.status(200).json({ resources, status: true });
    }
    catch (error) {
        console.error("Error fetching resources of project:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching resources of project" });
    }
};
exports.getAllResourcesOfProject = getAllResourcesOfProject;
const deleteHumanResource = async (req, res) => {
    const { resourceId } = req.params;
    try {
        // Check if the resource exists
        const resource = await index_model_1.default.findByPk(resourceId);
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }
        // Delete the resource
        await resource.destroy();
        return res
            .status(200)
            .json({ message: "Resource deleted successfully", status: true });
    }
    catch (error) {
        console.error("Error deleting resource:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while deleting resource" });
    }
};
exports.deleteHumanResource = deleteHumanResource;
const updateHumanResource = async (req, res) => {
    const { resourceId } = req.params;
    const { projectId, ...updatedData } = req.body; // Exclude projectId from updated data
    try {
        // Check if the resource exists
        let resource = await index_model_1.default.findByPk(resourceId);
        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }
        // Update the resource (excluding projectId)
        await resource.update(updatedData);
        // Fetch the updated resource with associated data
        resource = await index_model_1.default.findByPk(resourceId);
        return res.status(200).json(resource);
    }
    catch (error) {
        console.error("Error updating resource:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while updating resource" });
    }
};
exports.updateHumanResource = updateHumanResource;
