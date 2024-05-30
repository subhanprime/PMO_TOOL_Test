import { Router } from "express";
const router = Router();
import { createProject } from "../controllers/index";
import verifyJwt from "../middleware/verifyJWT";
import verifyRole from "../middleware/verifyRole";
import { ROLES } from "../config/roles";
import {
  getAllProjectsWithDetails,
  deleteProject,
  updateProject,
  getProjectDetailsWithStates,
} from "../controllers/index";
router.post(
  "/create",
  verifyJwt,
  //   verifyRole(ROLES.admin, ROLES.user),
  createProject
);
router.get("/all", verifyJwt, getAllProjectsWithDetails);
router.delete("/delete/:projectId", verifyJwt, deleteProject);
router.put("/update/:projectId", verifyJwt, updateProject);
router.get("/:id", verifyJwt, getProjectDetailsWithStates);
export default router;
