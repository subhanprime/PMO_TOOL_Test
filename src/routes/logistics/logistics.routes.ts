import { Router } from "express";
const router = Router();
import {
  createLogistics,
  getLogisticsByProject,
  deleteLogistics,
  updateLogistics,
} from "../../controllers/logistics/logistics.handler";
import verifyJwt from "../../middleware/verifyJWT";
router.post("/create", verifyJwt, createLogistics);
router.get("/:projectId", verifyJwt, getLogisticsByProject);
router.delete("/delete/:logisticsId", verifyJwt, deleteLogistics);
router.put("/update/:logisticsId", verifyJwt, updateLogistics);
export default router;
