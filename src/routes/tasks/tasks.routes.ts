import { Router } from "express";
import {
  createTask,
  getAllTasks,
  deleteAllTasks,
  getAllTasksByProject,
  changeTaskStatus,
  updateTask,
  deleteTask,
} from "../../controllers/tasks/tasks.controller";
const router = Router();
import verifyJwt from "../../middleware/verifyJWT";
import verifyRole from "../../middleware/verifyRole";

router.post("/create", verifyJwt, createTask);
router.get("/all", getAllTasks);
router.get("/project/:projectId/all", getAllTasksByProject);
router.delete("/delete/all", verifyJwt, deleteAllTasks);
router.delete("/delete/specific/:taskId", verifyJwt, deleteTask);
router.post("/change/status/:taskId", verifyJwt, changeTaskStatus);
router.post("/update/:taskId", verifyJwt, updateTask);
// router.post("/change/status/:taskId", verifyJwt, changeTaskStatus);
export default router;
