import { Request, Response } from "express";
import Task from "../../models/tasks/tasks.model";
import Users from "../../models/users/users";
import Joi from "joi";
import TaskCollaborators from "../../models/tasks/taskCollaborators.model";
import Project from "../../models/projects";
import TaskType from "../../models/taskType/taskType.model";

const taskSchema = Joi.object({
  creatorId: Joi.number().integer().required(),
  taskTypeId: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required(),
  priority: Joi.string()
    .valid("Minor", "Major", "Critical", "Blocker")
    .required(),
  status: Joi.string()
    .valid("Todo", "InReview", "InProgress", "Done")
    .required(),
  assignedToId: Joi.number().integer().required(),
  projectId: Joi.number().integer().required(),
  collaborators: Joi.array().items(Joi.number().integer()),
});

// export const createTask = async (req: Request, res: Response) => {
//   try {
//     const { error, value } = taskSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const {
//       creatorId,
//       taskTypeId,
//       title,
//       description,
//       start_date,
//       end_date,
//       priority,
//       status,
//       assignedToId,
//       collaborators,
//     } = value;

//     const [creator, assignedTo] = await Promise.all([
//       Users.findByPk(creatorId),
//       Users.findByPk(assignedToId),
//     ]);

//     if (!creator || !assignedTo) {
//       return res
//         .status(404)
//         .json({ message: "Creator or assignedTo not found" });
//     }

//     const newTask: any = await Task.create({
//       creatorId,
//       taskTypeId,
//       title,
//       description,
//       start_date,
//       end_date,
//       priority,
//       status,
//       assignedToId,
//     });

//     if (collaborators && collaborators.length > 0) {
//       await Promise.all(
//         collaborators.map(async (collaboratorId: number) => {
//           const collaborator = await Users.findByPk(collaboratorId);
//           if (collaborator) {
//             await TaskCollaborators.create({
//               taskId: newTask.id,
//               userId: collaboratorId,
//             });
//           }
//         })
//       );
//     }

//     return res.status(201).json(newTask);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const createTask = async (req: Request, res: Response) => {
  try {
    const { error, value } = taskSchema.validate({
      ...req.body,
      creatorId: req.userId,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      creatorId,
      taskTypeId,
      title,
      description,
      start_date,
      end_date,
      priority,
      status,
      assignedToId,
      collaborators,
      projectId, // Assuming projectId is included in req.body
    } = value;

    // Check if taskTypeId is valid
    const taskType = await TaskType.findByPk(taskTypeId);
    if (!taskType) {
      return res.status(400).json({ message: "Invalid taskTypeId" });
    }

    const [creator, assignedTo, project] = await Promise.all([
      Users.findByPk(creatorId),
      Users.findByPk(assignedToId),
      Project.findByPk(projectId), // Fetch the project associated with the task
    ]);

    if (!creator || !assignedTo || !project) {
      return res.status(404).json({
        message: "Creator, assignedTo, or project not found",
      });
    }

    const newTask: any = await Task.create({
      creatorId,
      taskTypeId,
      title,
      description,
      start_date,
      end_date,
      priority,
      status,
      assignedToId,
      projectId, // Assign the projectId to the task
    });

    if (collaborators && collaborators.length > 0) {
      await Promise.all(
        collaborators.map(async (collaboratorId: number) => {
          const collaborator = await Users.findByPk(collaboratorId);
          if (collaborator) {
            await TaskCollaborators.create({
              taskId: newTask.id,
              userId: collaboratorId,
            });
          }
        })
      );
    }

    return res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    // Fetch total count of tasks
    const totalCount = await Task.count();

    // Fetch tasks along with associated user information and collaborators with pagination
    const tasks = await Task.findAll({
      include: [
        // Include project information
        {
          model: Project,
          as: "project",
          attributes: ["id", "scope", "objective"],
        },
        // Include creator user information
        {
          model: Users,
          as: "creator",
          attributes: [
            "id",
            "full_name",
            "email",
            "avatar",
            "role",
            "department",
          ],
        },
        // Include assignedTo user information
        {
          model: Users,
          as: "assignedTo",
          attributes: [
            "id",
            "full_name",
            "email",
            "avatar",
            "role",
            "department",
          ],
        },
        // Include collaborators information
        {
          model: Users,
          as: "collaborators",
          attributes: [
            "id",
            "full_name",
            "email",
            "avatar",
            "role",
            "department",
          ],
          through: { attributes: [] }, // Exclude intermediate table attributes
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      tasks,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllTasks = async (req: Request, res: Response) => {
  try {
    // Delete all tasks
    await Task.destroy({
      where: {}, // Empty where clause to delete all records
    });

    return res.status(200).json({ message: "All tasks deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTasksByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId; // Assuming projectId is passed as a route parameter
    const page = req.query.page ? parseInt(req.query.page.toString()) : 1; // Current page number, default is 1
    const pageSize = 50; // Number of tasks per page

    // Fetch all tasks associated with the specified project
    const taskCount = await Task.count({ where: { projectId } });
    const totalPages = Math.ceil(taskCount / pageSize); // Calculate total pages

    const tasks = await Task.findAll({
      where: { projectId }, // Filter tasks by projectId
      include: [
        // Include project information
        {
          model: Project,
          as: "project",
          attributes: ["id", "scope", "objective"],
        },
        // Include creator user information
        {
          model: Users,
          as: "creator",
          attributes: [
            "id",
            "full_name",
            "email",
            "avatar",
            "role",
            "department",
          ],
        },
        // Include assignedTo user information
        {
          model: Users,
          as: "assignedTo",
          attributes: [
            "id",
            "full_name",
            "email",
            "avatar",
            "role",
            "department",
          ],
        },
        // Include collaborators information
        {
          model: Users,
          as: "collaborators",
          attributes: [
            "id",
            "full_name",
            "email",
            "avatar",
            "role",
            "department",
          ],
          through: { attributes: [] }, // Exclude intermediate table attributes
        },
      ],
      offset: (page - 1) * pageSize, // Offset based on the current page
      limit: pageSize, // Limit results to the page size
    });

    return res.status(200).json({ tasks, currentPage: page, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeTaskStatus = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter
    const { status } = req.body; // New status to be updated

    // Find the task by ID
    const task: any = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task's status
    task.status = status;
    await task.save();

    return res
      .status(200)
      .json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter
    const updatedTaskData = req.body; // Updated task data

    // Find the task by ID
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate that the assignedToId exists in Users table if it is being updated
    if (updatedTaskData.assignedToId) {
      const assignedUser = await Users.findByPk(updatedTaskData.assignedToId);
      if (!assignedUser) {
        return res.status(400).json({ message: "Assigned user not found" });
      }
    }

    // Update the task's attributes
    await task.update(updatedTaskData);

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter

    // Find the task by ID
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task from the database
    await task.destroy();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
