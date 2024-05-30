import dotenv from "dotenv";
import express, { Request, Response } from "express";
dotenv.config();
import helmet from "helmet";
import cors from "cors";
// const bodyParser = require('body-parser');
import bodyParser from "body-parser";
import { sequelize } from "./db/pgdb";
import rootRouter from "./routes/index";
import ErrorHandler from "./Errors/errorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import options from "./swaggerOptions";
import Project from "./models/projects";
import Teams from "./models/teams/teams.model";
import User from "./models/users/users";
import TeamUsers from "./models/teamsUsers/teamUser.model";
import Designation from "./models/designation/designation.model";
import Department from "./models/department/department.model";
import Country from "./models/country/country.model";
import Area from "./models/areas/areas.model";
import City from "./models/city/city.model";
import Tool from "./models/tools/tools.models";
import ProjectTools from "./models/projectTools/projectTools.model";
import TaskType from "./models/taskType/taskType.model";
import Tasks from "./models/tasks/tasks.model";
import TaskCollaborators from "./models/tasks/taskCollaborators.model";
import ProjectCreator from "./models/ProjectCreator";
import Logistics from "./models/logistics/logistics.model";
import HumanResources from "./models/human_Resources/index.model";
// import bcrypt from 'bcryptjs';

const app = express();

const corsOptions = {
  origin: "*", // Allow requests from all origins
  methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
  // allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
  // optionsSuccessStatus: 200 // Set a custom success status code for preflight OPTIONS requests
};
// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger documentation using swagger-ui-express
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use(helmet());
app.use(cors());
// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("*", ErrorHandler);

const port = 8080;

app.use("/api", rootRouter);

async function testDatabaseConnection() {
  try {
    // Authenticate Sequelize instance
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Synchronize individual models with the database
    await Project.sync({ alter: true });
    await Teams.sync({ alter: true });
    await User.sync({ alter: true });
    await TeamUsers.sync({ alter: true });
    await Designation.sync({ alter: true });
    await Department.sync({ alter: true });
    await Country.sync({ alter: true });
    await Area.sync({ alter: true });
    await City.sync({ alter: true });
    await Tool.sync({ alter: true });
    await ProjectTools.sync({ alter: true });
    await TaskType.sync({ alter: true });
    await Tasks.sync({ alter: true });
    await TaskCollaborators.sync({ alter: true });
    await ProjectCreator.sync({ alter: true });
    await Logistics.sync({ alter: true });
    await HumanResources.sync({ alter: true });

    console.log("Models synchronized successfully with the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

app.get("/", async (req: Request, res: Response) => {
  console.log("running");
  try {
    res.status(200).json({ message: "PMO Tool SERVER Running Here" });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port  ${port}`);
  testDatabaseConnection();
});
