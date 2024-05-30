"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dbName = process.env.Database_Name;
const dbUser = process.env.Database_User;
const dbPassword = process.env.Database_Password;
const dbHost = process.env.Database_Host;
const dbPort = process.env.Database_Port;
// Initialize Sequelize with database connection parameters
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
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
exports.sequelize = sequelize;
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
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
// syncDatabase();
const users_1 = __importDefault(require("../models/users/users"));
const teams_model_1 = __importDefault(require("../models/teams/teams.model"));
const teamUser_model_1 = __importDefault(require("../models/teamsUsers/teamUser.model"));
const projects_1 = __importDefault(require("../models/projects"));
const tools_models_1 = __importDefault(require("../models/tools/tools.models"));
const taskType_model_1 = __importDefault(require("../models/taskType/taskType.model"));
const tasks_model_1 = __importDefault(require("../models/tasks/tasks.model"));
const taskCollaborators_model_1 = __importDefault(require("../models/tasks/taskCollaborators.model"));
const ProjectCreator_1 = __importDefault(require("../models/ProjectCreator"));
const logistics_model_1 = __importDefault(require("../models/logistics/logistics.model"));
const index_model_1 = __importDefault(require("../models/human_Resources/index.model"));
// User model
users_1.default.belongsToMany(teams_model_1.default, { through: teamUser_model_1.default, foreignKey: "userId" });
// Team model
teams_model_1.default.belongsToMany(users_1.default, { through: teamUser_model_1.default, foreignKey: "teamId" });
// many to many relationship b/w projects and tools
projects_1.default.belongsToMany(tools_models_1.default, {
    through: "ProjectTools",
});
// project associate with creator name
projects_1.default.belongsToMany(users_1.default, {
    through: ProjectCreator_1.default,
    foreignKey: "ProjectId",
});
users_1.default.belongsToMany(projects_1.default, {
    through: ProjectCreator_1.default,
    foreignKey: "UserId",
});
// end projectCreator relationship
// hhhhhhhhhhhhhhhh
tools_models_1.default.belongsToMany(projects_1.default, { through: "ProjectTools" });
// task belongs to different tables
tasks_model_1.default.belongsTo(users_1.default, { as: "creator", foreignKey: "creatorId" });
tasks_model_1.default.belongsTo(users_1.default, { as: "assignedTo", foreignKey: "assignedToId" });
tasks_model_1.default.belongsToMany(users_1.default, {
    through: taskCollaborators_model_1.default,
    as: "collaborators",
    foreignKey: "taskId",
});
tasks_model_1.default.belongsTo(projects_1.default, { as: "project", foreignKey: "projectId" });
users_1.default.belongsToMany(tasks_model_1.default, {
    through: taskCollaborators_model_1.default,
    foreignKey: "userId",
});
tasks_model_1.default.belongsTo(taskType_model_1.default, { foreignKey: "taskTypeId" });
// Tasks.belongsTo(Project, { foreignKey: "projectId" });
// Project model
projects_1.default.hasMany(tasks_model_1.default, { as: "tasks", foreignKey: "projectId" });
// establish relationship between Logistics and Projects
projects_1.default.hasMany(logistics_model_1.default, { foreignKey: "projectId" });
logistics_model_1.default.belongsTo(projects_1.default, { foreignKey: "projectId" });
// ending relationship between Logistics and Projects
// relation one to many between projects and human resources
projects_1.default.hasMany(index_model_1.default, { foreignKey: "projectId" });
index_model_1.default.belongsTo(projects_1.default, { foreignKey: "projectId" });
