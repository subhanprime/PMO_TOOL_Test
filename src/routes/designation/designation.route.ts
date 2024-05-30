import { Router } from "express";
import {
  designationCreate,
  designationDelete,
  getAllDesignations,
} from "../../controllers";
import { ROLES } from "../../config/roles";
// import { Jwt } from "jsonwebtoken";
import verifyJwt from "../../middleware/verifyJWT";
import verifyRole  from "../../middleware/verifyRole";
const router = Router();
router.post("/create",  designationCreate);
router.delete(
  "/delete/:id",
  verifyJwt,
  verifyRole(ROLES.admin),
  designationDelete
);
router.get("/all", verifyJwt, getAllDesignations);
export default router;
