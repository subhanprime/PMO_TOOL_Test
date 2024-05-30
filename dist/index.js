"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
// const bodyParser = require('body-parser');
const body_parser_1 = __importDefault(require("body-parser"));
const pgdb_1 = require("./db/pgdb");
const index_1 = __importDefault(require("./routes/index"));
const errorHandler_1 = __importDefault(require("./Errors/errorHandler"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions_1 = __importDefault(require("./swaggerOptions"));
const projects_1 = __importDefault(require("./models/projects"));
const teams_model_1 = __importDefault(require("./models/teams/teams.model"));
const users_1 = __importDefault(require("./models/users/users"));
const teamUser_model_1 = __importDefault(require("./models/teamsUsers/teamUser.model"));
const designation_model_1 = __importDefault(require("./models/designation/designation.model"));
const department_model_1 = __importDefault(require("./models/department/department.model"));
const country_model_1 = __importDefault(require("./models/country/country.model"));
const areas_model_1 = __importDefault(require("./models/areas/areas.model"));
const city_model_1 = __importDefault(require("./models/city/city.model"));
const tools_models_1 = __importDefault(require("./models/tools/tools.models"));
const projectTools_model_1 = __importDefault(require("./models/projectTools/projectTools.model"));
const taskType_model_1 = __importDefault(require("./models/taskType/taskType.model"));
const tasks_model_1 = __importDefault(require("./models/tasks/tasks.model"));
const taskCollaborators_model_1 = __importDefault(require("./models/tasks/taskCollaborators.model"));
const ProjectCreator_1 = __importDefault(require("./models/ProjectCreator"));
const logistics_model_1 = __importDefault(require("./models/logistics/logistics.model"));
const index_model_1 = __importDefault(require("./models/human_Resources/index.model"));
// import bcrypt from 'bcryptjs';
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*", // Allow requests from all origins
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    // allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
    // optionsSuccessStatus: 200 // Set a custom success status code for preflight OPTIONS requests
};
// Initialize Swagger-jsdoc
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions_1.default);
// Serve Swagger documentation using swagger-ui-express
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// app.use(helmet());
app.use((0, cors_1.default)());
// Parse incoming request bodies in a middleware before your handlers
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("*", errorHandler_1.default);
const port = 8080;
app.use("/api", index_1.default);
async function testDatabaseConnection() {
    try {
        // Authenticate Sequelize instance
        await pgdb_1.sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        // Synchronize individual models with the database
        await projects_1.default.sync({ alter: true });
        await teams_model_1.default.sync({ alter: true });
        await users_1.default.sync({ alter: true });
        await teamUser_model_1.default.sync({ alter: true });
        await designation_model_1.default.sync({ alter: true });
        await department_model_1.default.sync({ alter: true });
        await country_model_1.default.sync({ alter: true });
        await areas_model_1.default.sync({ alter: true });
        await city_model_1.default.sync({ alter: true });
        await tools_models_1.default.sync({ alter: true });
        await projectTools_model_1.default.sync({ alter: true });
        await taskType_model_1.default.sync({ alter: true });
        await tasks_model_1.default.sync({ alter: true });
        await taskCollaborators_model_1.default.sync({ alter: true });
        await ProjectCreator_1.default.sync({ alter: true });
        await logistics_model_1.default.sync({ alter: true });
        await index_model_1.default.sync({ alter: true });
        console.log("Models synchronized successfully with the database.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
app.get("/", async (req, res) => {
    console.log("running");
    try {
        res.status(200).json({ message: "PMO Tool SERVER Running Here" });
    }
    catch (error) {
        console.error("Error executing query", error);
        res.status(500).json({ message: "Server Error" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port  ${port}`);
    testDatabaseConnection();
});
