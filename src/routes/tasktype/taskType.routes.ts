import { Router } from "express";
import {
  createTaskType,
  getAllTaskTypeNames,
  deleteTaskType,
} from "../../controllers/taskType/taskType.controllers";
const router = Router();
router.post("/create", createTaskType);
router.get("/all", getAllTaskTypeNames);
router.delete("/delete/:id", deleteTaskType);
export default router;
