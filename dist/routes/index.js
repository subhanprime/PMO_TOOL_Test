"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = __importDefault(require("./authentication/login"));
const users_routes_1 = __importDefault(require("./users.routes"));
const express_1 = require("express");
const active_account_routes_1 = __importDefault(require("./active_account.routes"));
const allUsers_routes_1 = __importDefault(require("./allUsers.routes"));
const controllers_1 = require("../controllers");
const projects_routes_1 = __importDefault(require("./projects.routes"));
const teams_routes_1 = __importDefault(require("./teams/teams.routes"));
const designation_route_1 = __importDefault(require("./designation/designation.route"));
const department_routes_1 = __importDefault(require("./department/department.routes"));
const country_routes_1 = __importDefault(require("./country/country.routes"));
const tools_routes_1 = __importDefault(require("./tools/tools.routes"));
const taskType_routes_1 = __importDefault(require("./tasktype/taskType.routes"));
const tasks_routes_1 = __importDefault(require("./tasks/tasks.routes"));
const logistics_routes_1 = __importDefault(require("./logistics/logistics.routes"));
const index_routes_1 = __importDefault(require("./human_resources/index.routes"));
const router = (0, express_1.Router)();
router.use("/account", active_account_routes_1.default);
router.use("/teams", teams_routes_1.default);
router.use("/user", users_routes_1.default);
router.use("/allUsers", allUsers_routes_1.default);
router.use("/login", login_1.default);
router.use("/resetPassword", controllers_1.resetPassword);
router.use("/project", projects_routes_1.default);
router.use("/designation", designation_route_1.default);
router.use("/department", department_routes_1.default);
router.use("/country", country_routes_1.default);
router.use("/tools", tools_routes_1.default);
router.use("/taskType", taskType_routes_1.default);
router.use("/tasks", tasks_routes_1.default);
router.use("/logistics", logistics_routes_1.default);
router.use("/project_hr", index_routes_1.default);
exports.default = router;
