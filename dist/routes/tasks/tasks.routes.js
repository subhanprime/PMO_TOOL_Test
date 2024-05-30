"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = require("../../controllers/tasks/tasks.controller");
const router = (0, express_1.Router)();
const verifyJWT_1 = __importDefault(require("../../middleware/verifyJWT"));
router.post("/create", verifyJWT_1.default, tasks_controller_1.createTask);
router.get("/all", tasks_controller_1.getAllTasks);
router.get("/project/:projectId/all", tasks_controller_1.getAllTasksByProject);
router.delete("/delete/all", verifyJWT_1.default, tasks_controller_1.deleteAllTasks);
router.delete("/delete/specific/:taskId", verifyJWT_1.default, tasks_controller_1.deleteTask);
router.post("/change/status/:taskId", verifyJWT_1.default, tasks_controller_1.changeTaskStatus);
router.post("/update/:taskId", verifyJWT_1.default, tasks_controller_1.updateTask);
// router.post("/change/status/:taskId", verifyJwt, changeTaskStatus);
exports.default = router;
