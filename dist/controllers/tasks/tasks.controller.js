"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.changeTaskStatus = exports.getAllTasksByProject = exports.deleteAllTasks = exports.getAllTasks = exports.createTask = void 0;
const tasks_model_1 = __importDefault(require("../../models/tasks/tasks.model"));
const users_1 = __importDefault(require("../../models/users/users"));
const joi_1 = __importDefault(require("joi"));
const taskCollaborators_model_1 = __importDefault(require("../../models/tasks/taskCollaborators.model"));
const projects_1 = __importDefault(require("../../models/projects"));
const taskType_model_1 = __importDefault(require("../../models/taskType/taskType.model"));
const taskSchema = joi_1.default.object({
    creatorId: joi_1.default.number().integer().required(),
    taskTypeId: joi_1.default.number().integer().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    start_date: joi_1.default.date().iso().required(),
    end_date: joi_1.default.date().iso().required(),
    priority: joi_1.default.string()
        .valid("Minor", "Major", "Critical", "Blocker")
        .required(),
    status: joi_1.default.string()
        .valid("Todo", "InReview", "InProgress", "Done")
        .required(),
    assignedToId: joi_1.default.number().integer().required(),
    projectId: joi_1.default.number().integer().required(),
    collaborators: joi_1.default.array().items(joi_1.default.number().integer()),
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
const createTask = async (req, res) => {
    try {
        const { error, value } = taskSchema.validate({
            ...req.body,
            creatorId: req.userId,
        });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { creatorId, taskTypeId, title, description, start_date, end_date, priority, status, assignedToId, collaborators, projectId, // Assuming projectId is included in req.body
         } = value;
        // Check if taskTypeId is valid
        const taskType = await taskType_model_1.default.findByPk(taskTypeId);
        if (!taskType) {
            return res.status(400).json({ message: "Invalid taskTypeId" });
        }
        const [creator, assignedTo, project] = await Promise.all([
            users_1.default.findByPk(creatorId),
            users_1.default.findByPk(assignedToId),
            projects_1.default.findByPk(projectId), // Fetch the project associated with the task
        ]);
        if (!creator || !assignedTo || !project) {
            return res.status(404).json({
                message: "Creator, assignedTo, or project not found",
            });
        }
        const newTask = await tasks_model_1.default.create({
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
            await Promise.all(collaborators.map(async (collaboratorId) => {
                const collaborator = await users_1.default.findByPk(collaboratorId);
                if (collaborator) {
                    await taskCollaborators_model_1.default.create({
                        taskId: newTask.id,
                        userId: collaboratorId,
                    });
                }
            }));
        }
        return res.status(201).json(newTask);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createTask = createTask;
const getAllTasks = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = 50;
        const offset = (page - 1) * pageSize;
        // Fetch total count of tasks
        const totalCount = await tasks_model_1.default.count();
        // Fetch tasks along with associated user information and collaborators with pagination
        const tasks = await tasks_model_1.default.findAll({
            include: [
                // Include project information
                {
                    model: projects_1.default,
                    as: "project",
                    attributes: ["id", "scope", "objective"],
                },
                // Include creator user information
                {
                    model: users_1.default,
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
                    model: users_1.default,
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
                    model: users_1.default,
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllTasks = getAllTasks;
const deleteAllTasks = async (req, res) => {
    try {
        // Delete all tasks
        await tasks_model_1.default.destroy({
            where: {}, // Empty where clause to delete all records
        });
        return res.status(200).json({ message: "All tasks deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteAllTasks = deleteAllTasks;
const getAllTasksByProject = async (req, res) => {
    try {
        const projectId = req.params.projectId; // Assuming projectId is passed as a route parameter
        const page = req.query.page ? parseInt(req.query.page.toString()) : 1; // Current page number, default is 1
        const pageSize = 50; // Number of tasks per page
        // Fetch all tasks associated with the specified project
        const taskCount = await tasks_model_1.default.count({ where: { projectId } });
        const totalPages = Math.ceil(taskCount / pageSize); // Calculate total pages
        const tasks = await tasks_model_1.default.findAll({
            where: { projectId }, // Filter tasks by projectId
            include: [
                // Include project information
                {
                    model: projects_1.default,
                    as: "project",
                    attributes: ["id", "scope", "objective"],
                },
                // Include creator user information
                {
                    model: users_1.default,
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
                    model: users_1.default,
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
                    model: users_1.default,
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllTasksByProject = getAllTasksByProject;
const changeTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter
        const { status } = req.body; // New status to be updated
        // Find the task by ID
        const task = await tasks_model_1.default.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Update the task's status
        task.status = status;
        await task.save();
        return res
            .status(200)
            .json({ message: "Task status updated successfully", task });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.changeTaskStatus = changeTaskStatus;
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter
        const updatedTaskData = req.body; // Updated task data
        // Find the task by ID
        const task = await tasks_model_1.default.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Validate that the assignedToId exists in Users table if it is being updated
        if (updatedTaskData.assignedToId) {
            const assignedUser = await users_1.default.findByPk(updatedTaskData.assignedToId);
            if (!assignedUser) {
                return res.status(400).json({ message: "Assigned user not found" });
            }
        }
        // Update the task's attributes
        await task.update(updatedTaskData);
        return res.status(200).json({ message: "Task updated successfully", task });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId; // Assuming taskId is passed as a route parameter
        // Find the task by ID
        const task = await tasks_model_1.default.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Delete the task from the database
        await task.destroy();
        return res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteTask = deleteTask;
