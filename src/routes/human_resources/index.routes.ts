import { Router } from "express";
import {
  addHumanResourceToProject,
  getAllResourcesOfProject,
  deleteHumanResource,
  updateHumanResource,
} from "../../controllers/humanResources/human_resources.handler";
const router = Router();

router.post("/create", addHumanResourceToProject);
router.get("/project/:projectId", getAllResourcesOfProject);
router.delete("/delete/:resourceId", deleteHumanResource);
router.put("/update/:resourceId", updateHumanResource);
export default router;
