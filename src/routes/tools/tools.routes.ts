import { Router } from "express";
import {
  createTools,
  getToolsByProject,
  removeToolFromProject,
  updateTool,
  getAllTools,
} from "../../controllers/tools/tools.controllers";
const router = Router();

router.post("/create/:projectId", createTools);
router.get("/all", getAllTools);
router.put("/update/:toolId", updateTool);
router.get("/project/:projectId", getToolsByProject);
router.delete("/:toolId/remove/project/:projectId", removeToolFromProject);

export default router;
