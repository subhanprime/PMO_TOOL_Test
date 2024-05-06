import { Router } from "express";
import { LoginControl } from "../../controllers/authentication/login.controller";
const router = Router();



router.post('/', LoginControl);
export default router;