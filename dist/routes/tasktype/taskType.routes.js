"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskType_controllers_1 = require("../../controllers/taskType/taskType.controllers");
const router = (0, express_1.Router)();
router.post("/create", taskType_controllers_1.createTaskType);
router.get("/all", taskType_controllers_1.getAllTaskTypeNames);
router.delete("/delete/:id", taskType_controllers_1.deleteTaskType);
exports.default = router;
