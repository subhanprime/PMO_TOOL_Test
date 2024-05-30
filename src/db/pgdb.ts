import { Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

const dbName = process.env.Database_Name;
const dbUser = process.env.Database_User;
const dbPassword = process.env.Database_Password;
const dbHost = process.env.Database_Host;
const dbPort = process.env.Database_Port;

// Initialize Sequelize with database connection parameters
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: Number(dbPort),
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Ignore SSL verification
    },
  },
});

// const sequelize = new Sequelize(
//   "xadautos_pmo",
//   "xadautos_pmo_user",
//   "S+zvv{sE@Ywg",
//   {
//     host: "88.80.188.27",
//     dialect: "mysql",
//     logging: console.log, // Enable logging
//     dialectOptions: {
//       connectTimeout: 10000, // 10 seconds
//     },
//   }
// );
const syncDatabase = async () => {
  try {
    // Drop tables in correct order to handle foreign key constraints
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.query("DROP TABLE IF EXISTS `ProjectTools`");
    await sequelize.query("DROP TABLE IF EXISTS `Projects`");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // Synchronize all models with the database
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
// syncDatabase();

import User from "../models/users/users";
import Team from "../models/teams/teams.model";
import TeamUsers from "../models/teamsUsers/teamUser.model";
import Project from "../models/projects";
import Tool from "../models/tools/tools.models";
import TaskType from "../models/taskType/taskType.model";
import Tasks from "../models/tasks/tasks.model";
import TaskCollaborators from "../models/tasks/taskCollaborators.model";
import ProjectCreator from "../models/ProjectCreator";
import Logistics from "../models/logistics/logistics.model";
import HumanResources from "../models/human_Resources/index.model";

// User model
User.belongsToMany(Team, { through: TeamUsers, foreignKey: "userId" });

// Team model
Team.belongsToMany(User, { through: TeamUsers, foreignKey: "teamId" });
// many to many relationship b/w projects and tools
Project.belongsToMany(Tool, {
  through: "ProjectTools",
});

// project associate with creator name
Project.belongsToMany(User, {
  through: ProjectCreator,
  foreignKey: "ProjectId",
});
User.belongsToMany(Project, {
  through: ProjectCreator,
  foreignKey: "UserId",
});
// end projectCreator relationship
// hhhhhhhhhhhhhhhh
Tool.belongsToMany(Project, { through: "ProjectTools" });

// task belongs to different tables
Tasks.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
Tasks.belongsTo(User, { as: "assignedTo", foreignKey: "assignedToId" });

Tasks.belongsToMany(User, {
  through: TaskCollaborators,
  as: "collaborators",
  foreignKey: "taskId",
});
Tasks.belongsTo(Project, { as: "project", foreignKey: "projectId" });

User.belongsToMany(Tasks, {
  through: TaskCollaborators,
  foreignKey: "userId",
});

Tasks.belongsTo(TaskType, { foreignKey: "taskTypeId" });
// Tasks.belongsTo(Project, { foreignKey: "projectId" });

// Project model
Project.hasMany(Tasks, { as: "tasks", foreignKey: "projectId" });

// establish relationship between Logistics and Projects
Project.hasMany(Logistics, { foreignKey: "projectId" });
Logistics.belongsTo(Project, { foreignKey: "projectId" });
// ending relationship between Logistics and Projects

// relation one to many between projects and human resources
Project.hasMany(HumanResources, { foreignKey: "projectId" });
HumanResources.belongsTo(Project, { foreignKey: "projectId" });
//end relation one to many between projects and human resources

export { sequelize };
