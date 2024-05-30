import { Router } from "express";
import {
  departmentCreate,
  deleteDepartment,
  getAllDepartments,
} from "../../controllers";
import verifyJwt from "../../middleware/verifyJWT";
import verifyRole  from "../../middleware/verifyRole";
import { ROLES } from "../../config/roles";
const router = Router();

router.post("/create", verifyJwt, verifyRole(ROLES.admin), departmentCreate);
router.delete(
  "/delete/:id",
  verifyJwt,
  verifyRole(ROLES.admin),
  deleteDepartment
);
router.get("/all",verifyJwt, getAllDepartments);
export default router;
