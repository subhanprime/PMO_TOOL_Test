import { Request, Response } from "express";
import Joi from "joi";
import Project from "../../models/projects/index";
import User from "../../models/users/users";
import { Sequelize } from "sequelize";
import { sequelize } from "../../db/pgdb";
import Task from "../../models/tasks/tasks.model";

// Define a schema for validating the request body using Joi
const projectSchema = Joi.object({
  title: Joi.string().required(),
  client: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  deadline: Joi.date().iso().required(),
  price: Joi.number().required(),
  scope: Joi.string().required(),
  objective: Joi.string().required(),
  creatorId: Joi.number().integer().required(),
  deliverables: Joi.string().required(),
  Key_Stake_holders_internals: Joi.array().items(Joi.string()).optional(),
  Key_Stake_holders_externals: Joi.array().items(Joi.string()).optional(),
});

export const createProject = async (req: Request, res: Response) => {
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
    const {
      title,
      client,
      description,
      start_date,
      deadline,
      price,
      scope,
      objective,
      creatorId,
      deliverables,
    } = value;

    // Check if the creator user exists
    const creator = await User.findByPk(creatorId);

    if (!creator) {
      return res.status(404).json({ message: "Creator user not found" });
    }

    console.log("creatorId", creatorId);

    // Create the project
    const newProject: any = await Project.create({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProjectsWithDetails = async (
  req: Request,
  res: Response
) => {
  try {
    // Fetch all projects with associated creator details
    const projects = await Project.findAll({
      include: [
        {
          model: User,
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
      } else {
        projectData.creator = null;
      }
      delete projectData.Users; // Remove the Users array from the project data
      return projectData;
    });

    // Send the projects as a response
    return res.status(200).json(projectsData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId; // Assuming projectId is passed as a route parameter

    // Find the project by its ID
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete the project
    await project.destroy();

    // Send success response
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProjectSchema = Joi.object({
  title: Joi.string().required(),
  client: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  deadline: Joi.date().iso().required(),
  price: Joi.number().required(),
  scope: Joi.string().required(),
  objective: Joi.string().required(),
  deliverables: Joi.string().required(),
  Key_Stake_holders_internals: Joi.array().items(Joi.string()).optional(),
  Key_Stake_holders_externals: Joi.array().items(Joi.string()).optional(),
});

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId; // Assuming projectId is passed as a route parameter

    // Validate request body against the schema
    const { error, value } = updateProjectSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
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
    } = value;

    // Check if the creator user exists
    // const creator = await User.findByPk(creatorId);

    // if (!creator) {
    //   return res.status(404).json({ message: "Creator user not found" });
    // }

    // Find the project by its ID
    const project = await Project.findByPk(projectId);

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectDetailsWithStates = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = req.params.id;

    // Fetch project details with associated tasks and task counts
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email"],
          through: { attributes: [] }, // Exclude attributes from the join table
        },
        {
          model: Task,
          as: "tasks", // Assuming this alias matches your Task association in Project
          attributes: [], // No task attributes needed in the main result
          required: false,
        },
      ],
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("tasks.id")), "totalTasks"],
          [
            sequelize.fn(
              "SUM",
              sequelize.literal(
                `CASE WHEN tasks.status = 'Todo' THEN 1 ELSE 0 END`
              )
            ),
            "tasksTodo",
          ],
          [
            sequelize.fn(
              "SUM",
              sequelize.literal(
                `CASE WHEN tasks.status = 'InProgress' THEN 1 ELSE 0 END`
              )
            ),
            "tasksInProgress",
          ],
          [
            sequelize.fn(
              "SUM",
              sequelize.literal(
                `CASE WHEN tasks.status = 'InReview' THEN 1 ELSE 0 END`
              )
            ),
            "tasksInReview",
          ],
          [
            sequelize.fn(
              "SUM",
              sequelize.literal(
                `CASE WHEN tasks.status = 'Done' THEN 1 ELSE 0 END`
              )
            ),
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
    } else {
      projectData.creator = null;
    }

    // Send success response with project details and task counts
    return res.status(200).json({
      message: "Project details fetched successfully",
      project: projectData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
