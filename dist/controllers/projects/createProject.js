"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDetailsWithStates = exports.updateProject = exports.deleteProject = exports.getAllProjectsWithDetails = exports.createProject = void 0;
const joi_1 = __importDefault(require("joi"));
const index_1 = __importDefault(require("../../models/projects/index"));
const users_1 = __importDefault(require("../../models/users/users"));
const pgdb_1 = require("../../db/pgdb");
const tasks_model_1 = __importDefault(require("../../models/tasks/tasks.model"));
// Define a schema for validating the request body using Joi
const projectSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    client: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    start_date: joi_1.default.date().iso().required(),
    deadline: joi_1.default.date().iso().required(),
    price: joi_1.default.number().required(),
    scope: joi_1.default.string().required(),
    objective: joi_1.default.string().required(),
    creatorId: joi_1.default.number().integer().required(),
    deliverables: joi_1.default.string().required(),
    Key_Stake_holders_internals: joi_1.default.array().items(joi_1.default.string()).optional(),
    Key_Stake_holders_externals: joi_1.default.array().items(joi_1.default.string()).optional(),
});
const createProject = async (req, res) => {
    try {
        console.log("req.userId", req.userId);
        // Validate project details against the schema
        const { error, value } = projectSchema.validate({
            ...req.body,
            creatorId: req.userId,
        });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        // Destructure validated project details
        const { title, client, description, start_date, deadline, price, scope, objective, creatorId, deliverables, } = value;
        // Check if the creator user exists
        const creator = await users_1.default.findByPk(creatorId);
        if (!creator) {
            return res.status(404).json({ message: "Creator user not found" });
        }
        console.log("creatorId", creatorId);
        // Create the project
        const newProject = await index_1.default.create({
            title,
            client,
            description,
            start_date,
            deadline,
            price,
            scope,
            objective,
            deliverables,
        });
        // Associate the project with the creator
        await newProject.addUser(creator, { through: { selfGranted: false } });
        // Send success response
        return res
            .status(201)
            .json({ message: "Project created successfully", project: newProject });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createProject = createProject;
const getAllProjectsWithDetails = async (req, res) => {
    try {
        // Fetch all projects with associated creator details
        const projects = await index_1.default.findAll({
            include: [
                {
                    model: users_1.default,
                    as: "Users", // Correct alias used in the association
                    attributes: [
                        "id",
                        "full_name",
                        "email",
                        "avatar",
                        "role",
                        "department",
                    ],
                    through: { attributes: [] }, // Exclude attributes from the join table
                },
            ],
        });
        // Transform the response to include a single creator object
        const projectsData = projects.map((project) => {
            const projectData = project.toJSON();
            if (projectData.Users && projectData.Users.length > 0) {
                projectData.creator = projectData.Users[0];
            }
            else {
                projectData.creator = null;
            }
            delete projectData.Users; // Remove the Users array from the project data
            return projectData;
        });
        // Send the projects as a response
        return res.status(200).json(projectsData);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllProjectsWithDetails = getAllProjectsWithDetails;
const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId; // Assuming projectId is passed as a route parameter
        // Find the project by its ID
        const project = await index_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        // Delete the project
        await project.destroy();
        // Send success response
        return res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteProject = deleteProject;
const updateProjectSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    client: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    start_date: joi_1.default.date().iso().required(),
    deadline: joi_1.default.date().iso().required(),
    price: joi_1.default.number().required(),
    scope: joi_1.default.string().required(),
    objective: joi_1.default.string().required(),
    deliverables: joi_1.default.string().required(),
    Key_Stake_holders_internals: joi_1.default.array().items(joi_1.default.string()).optional(),
    Key_Stake_holders_externals: joi_1.default.array().items(joi_1.default.string()).optional(),
});
const updateProject = async (req, res) => {
    try {
        const projectId = req.params.projectId; // Assuming projectId is passed as a route parameter
        // Validate request body against the schema
        const { error, value } = updateProjectSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { title, client, description, start_date, deadline, price, scope, objective, Key_Stake_holders_internals, Key_Stake_holders_externals, } = value;
        // Check if the creator user exists
        // const creator = await User.findByPk(creatorId);
        // if (!creator) {
        //   return res.status(404).json({ message: "Creator user not found" });
        // }
        // Find the project by its ID
        const project = await index_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        // Update the project
        await project.update({
            title,
            client,
            description,
            start_date,
            deadline,
            price,
            scope,
            objective,
            Key_Stake_holders_internals,
            Key_Stake_holders_externals,
        });
        // Send success response
        return res
            .status(200)
            .json({ message: "Project updated successfully", project });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateProject = updateProject;
const getProjectDetailsWithStates = async (req, res) => {
    try {
        const projectId = req.params.id;
        // Fetch project details with associated tasks and task counts
        const project = await index_1.default.findByPk(projectId, {
            include: [
                {
                    model: users_1.default,
                    attributes: ["id", "full_name", "email"],
                    through: { attributes: [] }, // Exclude attributes from the join table
                },
                {
                    model: tasks_model_1.default,
                    as: "tasks", // Assuming this alias matches your Task association in Project
                    attributes: [], // No task attributes needed in the main result
                    required: false,
                },
            ],
            attributes: {
                include: [
                    [pgdb_1.sequelize.fn("COUNT", pgdb_1.sequelize.col("tasks.id")), "totalTasks"],
                    [
                        pgdb_1.sequelize.fn("SUM", pgdb_1.sequelize.literal(`CASE WHEN tasks.status = 'Todo' THEN 1 ELSE 0 END`)),
                        "tasksTodo",
                    ],
                    [
                        pgdb_1.sequelize.fn("SUM", pgdb_1.sequelize.literal(`CASE WHEN tasks.status = 'InProgress' THEN 1 ELSE 0 END`)),
                        "tasksInProgress",
                    ],
                    [
                        pgdb_1.sequelize.fn("SUM", pgdb_1.sequelize.literal(`CASE WHEN tasks.status = 'InReview' THEN 1 ELSE 0 END`)),
                        "tasksInReview",
                    ],
                    [
                        pgdb_1.sequelize.fn("SUM", pgdb_1.sequelize.literal(`CASE WHEN tasks.status = 'Done' THEN 1 ELSE 0 END`)),
                        "tasksDone",
                    ],
                ],
            },
            group: ["Projects.id", "Users.id"], // Corrected table name to 'Projects' and alias for user to 'Users'
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        // Transform the response to include a single user object
        const projectData = project.toJSON();
        if (projectData.Users && projectData.Users.length > 0) {
            projectData.creator = projectData.Users[0];
            delete projectData.Users;
        }
        else {
            projectData.creator = null;
        }
        // Send success response with project details and task counts
        return res.status(200).json({
            message: "Project details fetched successfully",
            project: projectData,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getProjectDetailsWithStates = getProjectDetailsWithStates;
